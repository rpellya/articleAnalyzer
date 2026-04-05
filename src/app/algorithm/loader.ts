import path from 'path';
import fs, { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { Article, RawArticle } from '../types';

/**
 * Нормализует сырые данные статей к единому формату.
 */
export async function normalizeArticles(
    rawArticles: RawArticle[],
): Promise<Article[]> {
    return rawArticles.map((raw) => {
        if (!raw.id) throw new Error('[103] Missing required field: id');
        if (!raw.title) throw new Error('[103] Missing required field: title');
        if (raw.year && (typeof raw.year !== 'number' || raw.year < 1900)) {
            throw new Error('[103] Invalid year');
        }
        const year =
            raw.year !== undefined && raw.year !== null
                ? raw.year
                : new Date().getFullYear();
        if (typeof year !== 'number' || year < 1900)
            throw new Error(`[104] Invalid year: ${year}`);
        if (raw.citations !== undefined && !Array.isArray(raw.citations))
            throw new Error('[104] citations must be an array');
        return {
            id: String(raw.id),
            title: String(raw.title),
            year,
            authors: Array.isArray(raw.authors) ? raw.authors : [],
            citations: Array.isArray(raw.citations) ? raw.citations : [],
        };
    });
}

/**
 * Загружает статьи из JSON-файла с поддержкой потоковой обработки.
 * @param filePath - путь к файлу
 * @returns массив статей в нормализованном формате
 */
export async function loadArticlesFromFile(
    filePath: string,
    isLoad: boolean = false,
): Promise<Article[]> {
    if (isLoad) {
        const abs = path.resolve(filePath);
        if (!fs.existsSync(abs))
            throw new Error(`[101] File not found: ${filePath}`);
        let raw;
        try {
            raw = JSON.parse(fs.readFileSync(abs, 'utf8'));
        } catch {
            throw new Error(`[102] Invalid JSON: ${filePath}`);
        }
        if (!Array.isArray(raw)) throw new Error('[102] JSON must be an array');
        return normalizeArticles(raw);
    }

    const stream = createReadStream(filePath, { encoding: 'utf8' });
    const rl = createInterface({ input: stream, crlfDelay: Infinity });

    let buffer = '';
    try {
        for await (const line of rl) {
            buffer += line;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        // Ошибка при чтении файла (например, файл не найден)
        throw new Error('File not found');
    }

    let data;
    try {
        data = JSON.parse(buffer);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        throw new Error('Invalid JSON format');
    }

    const articles = Array.isArray(data) ? data : data.articles;
    // normalizeArticles выбросит собственную ошибку, если данные некорректны
    return normalizeArticles(articles);
}
