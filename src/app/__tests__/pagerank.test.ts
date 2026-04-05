import { buildDense, buildSparse } from '../algorithm/graph';
import { pagerankDense, pagerankSparse } from '../algorithm/pagerank';

describe('PageRank', () => {
    const articles = [
        { id: '1', title: 'A', authors: [], year: 2020, citations: ['2'] },
        { id: '2', title: 'B', authors: [], year: 2020, citations: ['1', '3'] },
        { id: '3', title: 'C', authors: [], year: 2020, citations: ['1'] },
    ];
    const graphSparse = buildSparse(articles);
    const graphDense = buildDense(articles);
    const { n } = graphDense;

    test('Сравнение двух реализаций (результаты должны совпадать)', () => {
        const prSparse = pagerankSparse(graphSparse, 0.85, 20);
        const prDense = pagerankDense(graphDense, 0.85, 20);
        for (let i = 0; i < n; i += 1) {
            expect(prSparse[i]).toBeCloseTo(prDense[i], 6);
        }
    });

    test('iterations = 1 (минимальное допустимое)', () => {
        expect(() => pagerankSparse(graphSparse, 0.85, 1)).not.toThrow();
    });

    test('iterations = 0 (недопустимо)', () => {
        expect(() => pagerankSparse(graphSparse, 0.85, 0)).toThrow(
            'Iterations must be >= 1',
        );
    });

    test('damping = 0.5 (допустимо)', () => {
        const pr = pagerankSparse(graphSparse, 0.5, 20);
        expect(pr).toBeDefined();
    });

    test('damping = 1 (недопустимо)', () => {
        expect(() => pagerankSparse(graphSparse, 1, 20)).toThrow(
            'Damping must be in (0,1)',
        );
    });
});
