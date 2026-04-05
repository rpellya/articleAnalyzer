import fs from 'fs';
import { Readable } from 'stream';
import { loadArticlesFromFile } from '../algorithm/loader';

jest.mock('fs');

describe('Модуль загрузки JSON', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Загрузка корректного файла', async () => {
        const mockData = JSON.stringify([
            {
                id: '1',
                title: 'Article 1',
                authors: ['A'],
                year: 2020,
                citations: [],
            },
        ]);
        const mockStream = Readable.from([mockData]);
        (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

        const articles = await loadArticlesFromFile('valid.json');
        expect(articles).toHaveLength(1);
        expect(articles[0]).toMatchObject({ id: '1', title: 'Article 1' });
    });

    test('Загрузка несуществующего файла', async () => {
        // Создаём поток, который сразу генерирует ошибку
        const errorStream = new Readable();
        errorStream._read = () => {};
        process.nextTick(() => errorStream.emit('error', new Error('ENOENT')));
        (fs.createReadStream as jest.Mock).mockReturnValue(errorStream);

        await expect(loadArticlesFromFile('missing.json')).rejects.toThrow(
            'File not found',
        );
    });

    test('Загрузка файла с отсутствующим id', async () => {
        const mockData = JSON.stringify([
            { title: 'No ID', authors: ['A'], year: 2020, citations: [] },
        ]);
        const mockStream = Readable.from([mockData]);
        (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

        await expect(loadArticlesFromFile('no-id.json')).rejects.toThrow(
            'Missing required field: id',
        );
    });

    test('Загрузка файла с некорректным JSON (синтаксис)', async () => {
        const mockData = '{ "id": 1, "title": "Broken" '; // невалидный JSON
        const mockStream = Readable.from([mockData]);
        (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

        await expect(
            loadArticlesFromFile('invalid-syntax.json'),
        ).rejects.toThrow('Invalid JSON format');
    });

    test('Граничные значения года: 1900 (допустимо)', async () => {
        const mockData = JSON.stringify([
            {
                id: '1',
                title: 'Old',
                authors: ['A'],
                year: 1900,
                citations: [],
            },
        ]);
        const mockStream = Readable.from([mockData]);
        (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

        const articles = await loadArticlesFromFile('min-year.json');
        expect(articles[0].year).toBe(1900);
    });

    test('Граничные значения года: 1899 (недопустимо)', async () => {
        const mockData = JSON.stringify([
            {
                id: '1',
                title: 'Too Old',
                authors: ['A'],
                year: 1899,
                citations: [],
            },
        ]);
        const mockStream = Readable.from([mockData]);
        (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

        await expect(loadArticlesFromFile('invalid-year.json')).rejects.toThrow(
            'Invalid year',
        );
    });
});
