import fs from 'fs';
import { ensureData } from '../ensureData';
import { BOLD, CYAN, GRAY, GREEN } from '../tools';
import { state } from '../state';
import { pagerankSparse } from '../algorithm/pagerank';

export function cmdExport(outFile: string, iter: number, damping: number) {
    if (!ensureData()) return;

    if (!state.sparse) {
        console.log('Нет данных для экспорта');
        return;
    }

    const pr = pagerankSparse(state.sparse, damping, iter);

    if (!state.sparse || !state.articles) return;

    const edges = state.sparse.outLinks.reduce((s, l) => s + l.length, 0);
    const result = {
        metadata: {
            timestamp: new Date().toISOString(),
            source: state.loadedFile || 'demo',
            articles_count: state.articles.length,
            edges_count: edges,
            avg_degree: parseFloat((edges / state.sparse.n).toFixed(4)),
            iterations: iter,
            damping,
        },
        pagerank: state.articles
            .map((a, i) => ({
                article_id: a.id,
                title: a.title,
                year: a.year,
                rank: pr[i],
            }))
            .sort((a, b) => b.rank - a.rank),
    };

    try {
        fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
        console.log(GREEN('  ✓ Результаты экспортированы: ') + CYAN(outFile));
        console.log(GRAY('  Статей в отчёте: ') + BOLD(result.pagerank.length));
    } catch (e: any) {
        throw new Error(`[108] Ошибка записи в файл: ${e.message}`);
    }
}
