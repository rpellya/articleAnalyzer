import { GraphDense, GraphSparse } from '../types';

export function pagerankSparse(
    graph: GraphSparse,
    damping: number,
    iterations: number,
): number[] {
    if (iterations < 1) throw new Error('Iterations must be >= 1');
    if (damping <= 0 || damping >= 1)
        throw new Error('Damping must be in (0,1)');

    const { n, outDegree, outLinks } = graph;

    let pr: number[] = Array(n).fill(1 / n);

    for (let k = 0; k < iterations; k += 1) {
        const newPr = Array(n).fill((1 - damping) / n);
        for (let v = 0; v < n; v += 1) {
            if (outDegree[v] > 0) {
                // ветка true
                const c = (damping * pr[v]) / outDegree[v];

                for (const j of outLinks[v]) newPr[j] += c;
            } else {
                // висячая вершина
                const c = (damping * pr[v]) / n;
                for (let j = 0; j < n; j += 1) newPr[j] += c;
            }
        }
        pr = newPr;
    }

    return pr;
}

/**
 * Плотная версия PageRank.
 */
export function pagerankDense(
    graph: GraphDense,
    damping: number,
    iterations: number,
): number[] {
    if (iterations < 1) throw new Error('Iterations must be >= 1');
    if (damping <= 0 || damping >= 1)
        throw new Error('Damping must be in (0,1)');

    const { n, matrix } = graph;

    const M = Array.from({ length: n }, (_, i) => {
        const deg = matrix[i].reduce((s, v) => s + v, 0);
        return Array.from({ length: n }, (_, j) =>
            deg > 0 ? matrix[i][j] / deg : 1 / n,
        );
    });

    let pr: number[] = Array(n).fill(1 / n);

    for (let k = 0; k < iterations; k += 1) {
        const np = Array(n).fill((1 - damping) / n);
        for (let j = 0; j < n; j += 1)
            for (let i = 0; i < n; i += 1) np[j] += damping * M[i][j] * pr[i];
        pr = np;
    }

    return pr;
}
