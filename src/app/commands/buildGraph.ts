import { state } from '../state';
import { ensureData } from '../ensureData';
import { BOLD, CYAN, GRAY, GREEN, HR, NL, YELLOW } from '../tools';

export function cmdBuildGraph() {
    if (!ensureData()) return;

    if (!state.sparse) {
        console.log('Ошибка с построением графа, нет sparse-представления');
        return;
    }

    const edges = state.sparse.outLinks.reduce((s, l) => s + l.length, 0);
    const dangling = state.sparse.outDegree.filter((d) => d === 0).length;
    const avgDeg = (edges / state.sparse.n).toFixed(2);

    NL();
    console.log(HR());
    console.log(BOLD('  Граф цитирования'));
    console.log(HR());
    NL();

    console.log(
        GRAY('  Представление 1: ') +
            CYAN(BOLD('Плотная матрица')) +
            GRAY(' [Способ 1, O(N²)]'),
    );
    console.log(
        GRAY('  Представление 2: ') +
            GREEN(BOLD('Разреженные списки')) +
            GRAY(' [Способ 2, O(N+E)]'),
    );
    NL();
    console.log(GRAY('  Вершин:            ') + BOLD(state.sparse.n));
    console.log(GRAY('  Рёбер:             ') + BOLD(edges));
    console.log(GRAY('  Средняя степень:   ') + BOLD(avgDeg));
    console.log(
        GRAY('  Висячих вершин:    ') +
            BOLD(dangling) +
            GRAY('  (outDegree = 0, равномерное распределение)'),
    );
    NL();

    if (!state.articles) {
        console.log('Ошибка с построением графа, нет articles');
        return;
    }

    // Матрица смежности (до 8×8)
    const n = Math.min(state.sparse.n, 8);
    const labels = state.articles
        .slice(0, n)
        .map((a) => a.id.slice(0, 5).padEnd(6));
    const header = GRAY('        ') + labels.map((l) => GRAY(l)).join('');
    console.log(GRAY('  Матрица смежности') + GRAY(` (первые ${n}×${n}):`));
    console.log(`  ${header}`);

    for (let i = 0; i < n; i += 1) {
        const row = Array.from({ length: n }, (_, j) => {
            if (!state.dense) return GRAY('  0   ');

            const v = state.dense.matrix[i][j];
            return v ? GREEN('  1   ') : GRAY('  0   ');
        }).join('');
        console.log(GRAY(`  ${labels[i]}`) + row);
    }
    NL();

    // Списки смежности
    console.log(GRAY('  Списки смежности (out[v]):'));
    state.articles.slice(0, 10).forEach((a, i) => {
        if (!state.sparse) {
            console.log(
                GRAY('  ') + BOLD(a.id.padEnd(8)) + GRAY('→ [') + GRAY(']'),
            );
            return;
        }

        const neighbors =
            state.sparse.outLinks[i]
                .map((j) => CYAN(state.articles ? state.articles[j].id : '0'))
                .join(', ') || GRAY('—');

        const deg = state.sparse.outDegree[i];

        console.log(
            GRAY('  ') +
                BOLD(a.id.padEnd(8)) +
                GRAY('→ [') +
                neighbors +
                GRAY(']') +
                GRAY(`  deg=${deg}`) +
                (deg === 0 ? YELLOW('  ← висячая') : ''),
        );
    });
}
