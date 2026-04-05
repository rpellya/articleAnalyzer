import { describe } from 'node:test';
import { buildDense, buildSparse } from '../algorithm/graph';

describe('Построение графа', () => {
    const articles = [
        { id: '1', title: 'A', authors: [], year: 2020, citations: ['2'] },
        { id: '2', title: 'B', authors: [], year: 2020, citations: ['1', '3'] },
        { id: '3', title: 'C', authors: [], year: 2020, citations: ['1'] },
    ];

    test('Разреженное представление – проверка ветвей outDegree > 0 и =0', () => {
        const graph = buildSparse(articles);
        expect(graph.outDegree).toEqual([1, 2, 1]);
        expect(graph.outLinks[0]).toEqual([1]);
        expect(graph.outLinks[1]).toEqual([0, 2]);
        expect(graph.outLinks[2]).toEqual([0]);
    });

    test('Плотное представление', () => {
        const graph = buildDense(articles);
        expect(graph.matrix[0][1]).toBe(1);
        expect(graph.matrix[1][0]).toBe(1);
        expect(graph.matrix[1][2]).toBe(1);
        expect(graph.matrix[2][0]).toBe(1);
        expect(graph.matrix[0][2]).toBe(0);
    });

    test('Игнорирование отсутствующих ссылок', () => {
        const articlesMissing = [
            {
                id: '1',
                title: 'A',
                authors: [],
                year: 2020,
                citations: ['2', '4'],
            },
            { id: '2', title: 'B', authors: [], year: 2020, citations: [] },
        ];
        const graph = buildSparse(articlesMissing);
        expect(graph.outLinks[0]).toEqual([1]); // только ссылка на '2'
    });
});
