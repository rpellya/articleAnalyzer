import { BOLD, CYAN, GRAY, GREEN, HR, NL, YELLOW } from '../tools';
import { ensureData } from '../ensureData';
import { state } from '../state';
import { pagerankDense, pagerankSparse } from '../algorithm/pagerank';

export function cmdCompare(iter: number, damping: number) {
    if (!ensureData()) return;
    NL();
    console.log(HR('═'));
    console.log(BOLD('  Сравнение производительности алгоритмов PageRank'));
    console.log(HR('═'));
    console.log(
        GRAY('  iterations=') + BOLD(iter) + GRAY('  damping=') + BOLD(damping),
    );
    NL();

    // Прогоняем каждый метод по 3 раза, берём среднее
    const runs = 3;
    let sumDense = 0;
    let sumSparse = 0;
    let prDense!: number[];
    let prSparse!: number[];

    if (!state.dense) {
        console.log('невозможно сравнить, нет state.dense');
        return;
    }

    if (!state.sparse) {
        console.log('невозможно сравнить, нет state.sparse');
        return;
    }

    for (let r = 0; r < runs; r += 1) {
        let t = Date.now();
        prDense = pagerankDense(state.dense, damping, iter);
        sumDense += Date.now() - t;
        t = Date.now();
        prSparse = pagerankSparse(state.sparse, damping, iter);
        sumSparse += Date.now() - t;
    }

    const tDense = (sumDense / runs).toFixed(2);
    const tSparse = (sumSparse / runs).toFixed(2);

    // Проверяем совпадение
    let maxDiff = 0;
    for (let i = 0; i < state.sparse.n; i += 1) {
        maxDiff = Math.max(maxDiff, Math.abs(prDense[i] - prSparse[i]));
    }

    const COL = 28;
    const row = (label: string, v1: string | number, v2: string | number) =>
        console.log(
            GRAY(`  ${label.padEnd(26)}`) +
            CYAN(String(v1).padEnd(COL)) +
            GREEN(String(v2)),
        );

    console.log(
        GRAY(`  ${''.padEnd(26)}`) +
        CYAN(BOLD('Способ 1: Матрица'.padEnd(COL))) +
        GREEN(BOLD('Способ 2: Спис. смежности')),
    );
    console.log(GRAY(`  ${'─'.repeat(72)}`));

    row('Структура', 'Плотная матрица N×N', 'Списки смежности');
    row('Память', 'O(N²)', 'O(N + E)');
    row('Итерация', 'O(N²)', 'O(N + E)');
    row('N (вершин)', state.sparse.n, state.sparse.n);
    row(
        'E (рёбер)',
        state.sparse.outLinks.reduce(
            (s: any, l: string | any[]) => s + l.length,
            0,
        ),
        state.sparse.outLinks.reduce(
            (s: any, l: string | any[]) => s + l.length,
            0,
        ),
    );
    row('Итераций', iter, iter);
    row(`Время, мс (avg ${runs} runs)`, `${tDense} мс`, `${tSparse} мс`);
    NL();

    if (maxDiff < 1e-9) {
        console.log(GREEN('  ✓ Результаты идентичны (|diff| < 1e-9)'));
    } else {
        console.log(
            YELLOW(`  ≈ Максимальное отклонение: ${maxDiff.toExponential(3)}`),
        );
    }

    // Топ по обоим методам рядом
    NL();
    console.log(HR());
    console.log(BOLD('  Ранжирование статей (оба метода):'));
    NL();

    if (!state.articles) {
        console.log(
            'Ошибка с построением графа, нет articles, не могу вывести топ по обоим методам',
        );
        return;
    }

    const rD = state.articles
        .map((a, i) => ({ ...a, rank: prDense[i] }))
        .sort((a, b) => b.rank - a.rank);
    const rS = state.articles
        .map((a, i) => ({ ...a, rank: prSparse[i] }))
        .sort((a, b) => b.rank - a.rank);
    const topN = Math.min(7, state.articles.length);

    console.log(
        GRAY('  #   ') +
        CYAN(BOLD('Матрица                          ')) +
        GREEN(BOLD('Разреженные списки')),
    );
    console.log(GRAY(`  ${'─'.repeat(72)}`));

    for (let i = 0; i < topN; i += 1) {
        console.log(
            GRAY(`  ${String(i + 1).padEnd(4)}`) +
            CYAN(
                `${rD[i].title.slice(0, 30)}  ${rD[i].rank.toFixed(
                    6,
                )}`.padEnd(40),
            ) +
            GREEN(`${rS[i].title.slice(0, 30)}  ${rS[i].rank.toFixed(6)}`),
        );
    }
}
