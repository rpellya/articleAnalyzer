import { validateArticle } from '../algorithm/validator';

describe('Валидация статей', () => {
    test.each([
        [{ id: null, title: 'A' }, false], // нет id
        [{ id: 1, title: 'A' }, false], // id не строка
        [{ id: '1' }, false], // нет title
        [{ id: '1', title: null }, false], // нет title
        [{ id: '1', title: 123 }, false],
        [{ id: '1', title: 'A', year: 2020 }, true],
        [{ id: '1', title: 'A', year: '2020' }, false],
        [{ id: '1', title: 'A', year: 1899 }, false],
        [{ id: '1', title: 'A' }, true],
        [{ id: '1', title: 'A', authors: ['John'] }, true],
        [{ id: '1', title: 'A', authors: 'John' }, false],
        [{ id: '1', title: 'A', citations: ['2'] }, true],
        [{ id: '1', title: 'A', citations: '2' }, false],
    ])('validateArticle(%p) = %p', (input, expected) => {
        expect(validateArticle(input)).toBe(expected);
    });
});
