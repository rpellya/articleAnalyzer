import { BOLD, CYAN, DIM, GRAY, GREEN, HR, NL, WHITE, YELLOW } from '../tools';
import { ensureData } from '../ensureData';
import { state } from '../state';
import { pagerankDense, pagerankSparse } from '../algorithm/pagerank';

export function cmdPageRank(method: string, iter: number, damping: number) {
    if (!ensureData()) return;
    const useSparse = method !== 'matrix';

    NL();
    console.log(HR());
    console.log(
        `${BOLD('  PageRank')}  ·  Метод: ${
            useSparse
                ? GREEN(BOLD('Разреженные списки [Способ 2]'))
                : CYAN(BOLD('Плотная матрица [Способ 1]'))
        }`,
    );
    console.log(HR());
    console.log(
        GRAY('  Формула: ') +
            WHITE('PR = d·M·PR + (1−d)/N·1') +
            GRAY('   iterations=') +
            BOLD(iter) +
            GRAY('   damping=') +
            BOLD(damping),
    );
    NL();

    const t0 = Date.now();

    if (!state.dense) {
        console.log('   Нет dense-представления');
        return;
    }
    if (!state.sparse) {
        console.log('Нет sparse-представления');
        return;
    }

    const pr = useSparse
        ? pagerankSparse(state.sparse, damping, iter)
        : pagerankDense(state.dense, damping, iter);
    const elapsed = Date.now() - t0;

    if (!state.articles) {
        console.log('Нет статей');
        return;
    }

    const ranked = state.articles
        .map((a, i) => ({ ...a, rank: pr[i] }))
        .sort((a, b) => b.rank - a.rank);
    const maxR = ranked[0].rank;

    const topN = Math.min(10, ranked.length);
    console.log(BOLD(`  Топ-${topN} статей по PageRank:`));
    NL();

    ranked.slice(0, topN).forEach(
        (
            a: {
                rank: number;
                title: string;
                year: { toString: () => string };
                id: any;
            },
            i: number,
        ) => {
            const bar = Math.round((a.rank / maxR) * 28);
            const filled = (useSparse ? GREEN : CYAN)('█'.repeat(bar));
            const empty = GRAY('░'.repeat(28 - bar));
            const num = String(i + 1).padStart(2);
            const medal =
                // eslint-disable-next-line no-nested-ternary
                i === 0 ? YELLOW(' ★') : i < 3 ? GRAY(' ·') : '  ';
            console.log(
                `${GRAY(`  ${num}.`) + medal}  ${BOLD(
                    a.title.slice(0, 44).padEnd(45),
                )}${GRAY(' rank: ')}${GREEN(a.rank.toFixed(6))}`,
            );

            if (!state.sparse) {
                console.log('Нет sparse-представления');
                return;
            }
            if (!state.articles) {
                console.log('Нет статей');
                return;
            }

            console.log(
                GRAY('       ') +
                    filled +
                    empty +
                    GRAY('  ') +
                    DIM(a.year.toString()) +
                    GRAY('  out: ') +
                    DIM(
                        String(
                            state.sparse.outDegree[
                                state.articles.findIndex(
                                    (x: { id: any }) => x.id === a.id,
                                )
                            ],
                        ),
                    ),
            );
        },
    );
    NL();
    console.log(GRAY('  Время:            ') + YELLOW(`${elapsed} мс`));
    console.log(
        GRAY('  Сложность памяти: ') +
            (useSparse ? GREEN('O(N + E)') : CYAN('O(N²)')),
    );
    console.log(
        GRAY('  Сложность итерации: ') +
            (useSparse ? GREEN('O(N + E)') : CYAN('O(N²)')),
    );
}
