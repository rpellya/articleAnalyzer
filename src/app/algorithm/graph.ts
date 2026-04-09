import { Article, GraphDense, GraphSparse } from '../types';

/**
 * Строит разреженное представление графа.
 */
export function buildSparse(articles: Article[]): GraphSparse {
    const n = articles.length;

    const idx = new Map(articles.map((a, i) => [a.id, i]));
    const outLinks: number[][] = Array.from({ length: n }, () => []);
    const inLinks: number[][] = Array.from({ length: n }, () => []);
    const outDegree = Array(n).fill(0);

    articles.forEach((a, i) => {
        (a.citations || []).forEach((cid) => {
            const j = idx.get(cid);
            if (j === undefined) return; // ignoreMissing
            outLinks[i].push(j);
            inLinks[j].push(i);
            outDegree[i] += 1;
        });
    });

    return { outLinks, inLinks, outDegree, n };
}

/**
 * Строит плотную матрицу смежности.
 */
export function buildDense(articles: Article[]): GraphDense {
    const n = articles.length;
    const idx = new Map(articles.map((a, i) => [a.id, i]));
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

    articles.forEach((a, i) =>
        (a.citations || []).forEach((cid) => {
            const j = idx.get(cid);

            if (j !== undefined) matrix[i][j] = 1;
        }),
    );

    return { matrix, n };
}
