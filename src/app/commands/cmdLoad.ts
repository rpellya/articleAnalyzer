import { buildDense, buildSparse } from '../algorithm/graph';
import { state } from '../state';
import { BOLD, CYAN, GRAY, GREEN } from '../tools';
import { loadArticlesFromFile } from '../algorithm/loader';

export async function cmdLoad(filePath: string, silent = false) {
    if (!silent) console.log(GRAY('  Загрузка: ') + CYAN(filePath));

    state.articles = await loadArticlesFromFile(filePath, true);
    state.sparse = buildSparse(state.articles);
    state.dense = buildDense(state.articles);
    state.loadedFile = filePath;

    const edges = state.sparse.outLinks.reduce((s, l) => s + l.length, 0);

    if (!silent) {
        console.log(
            GREEN('  ✓ Загружено статей : ') + BOLD(state.articles.length),
        );
        console.log(GREEN('  ✓ Вершин в графе   : ') + BOLD(state.sparse.n));
        console.log(GREEN('  ✓ Рёбер (ссылок)   : ') + BOLD(edges));
    } else {
        console.log(
            GREEN('  ✓ ') +
            GRAY('Загружено ') +
            BOLD(state.articles.length) +
            GRAY(' статей, ') +
            BOLD(edges) +
            GRAY(' ссылок'),
        );
    }
}
