import { pagerankSparse } from '../algorithm/pagerank';
import { ensureData } from '../ensureData';
import { state } from '../state';
import { BOLD, CYAN, GRAY, GREEN, HR, NL, YELLOW } from '../tools';

export function cmdReport() {
    if (!ensureData()) return;

    if (!state.sparse) {
        console.log('Ошибка с отчетом');
        return;
    }

    const pr = pagerankSparse(state.sparse, 0.85, 20);

    const edges = state.sparse.outLinks.reduce((s, l) => s + l.length, 0);
    const dangling = state.sparse.outDegree.filter((d) => d === 0).length;

    NL();
    console.log(HR('═'));
    console.log(BOLD(CYAN('  === Анализ графа цитирования ===')));
    console.log(HR('═'));
    NL();
    console.log(
        GRAY('  Источник данных:    ') + CYAN(state.loadedFile || 'demo'),
    );

    if (!state.articles) {
        console.log('Нет статей, поэтому не могу посчитать PageRank');
        return;
    }

    console.log(GRAY('  Всего статей:       ') + BOLD(state.articles.length));
    console.log(GRAY('  Всего цитирований:  ') + BOLD(edges));
    console.log(
        GRAY('  Средняя степень:    ') +
        BOLD((edges / state.sparse.n).toFixed(2)),
    );
    console.log(GRAY('  Висячих вершин:     ') + BOLD(dangling));
    NL();

    const ranked = state.articles
        .map((a, i) => ({ ...a, rank: pr[i] }))
        .sort((a, b) => b.rank - a.rank);

    console.log(BOLD('  Топ статей по PageRank (метод: разреженные списки):'));
    NL();

    ranked.forEach((a, i) => {
        const medal = i === 0 ? YELLOW('★') : i < 3 ? GRAY('·') : GRAY(' ');
        console.log(
            GRAY('  ') +
            medal +
            GRAY(` ${i + 1}.`.padEnd(5)) +
            BOLD(`"${a.title.slice(0, 52)}"`) +
            GRAY('  (rank: ') +
            GREEN(a.rank.toFixed(6)) +
            GRAY(')'),
        );
    });
}
