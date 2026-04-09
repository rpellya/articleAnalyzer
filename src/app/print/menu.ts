import { BOLD, CYAN, GRAY, HR, NL, RED } from '../tools';

export const MENU_ITEMS = [
    { key: '1', label: 'Загрузить статьи из файла', action: 'load' },
    {
        key: '2',
        label: 'Построить граф цитирования',
        action: 'build-graph',
    },
    {
        key: '3',
        label: 'Рассчитать PageRank — разреженные списки [Способ 2]',
        action: 'pr-sparse',
    },
    {
        key: '4',
        label: 'Рассчитать PageRank — плотная матрица [Способ 1]',
        action: 'pr-matrix',
    },
    {
        key: '5',
        label: 'Сравнить производительность методов',
        action: 'compare',
    },
    { key: '6', label: 'Вывести отчёт', action: 'report' },
    {
        key: '7',
        label: 'Экспортировать результаты в JSON',
        action: 'export',
    },
    { key: '8', label: 'Запустить все тесты', action: 'test-all' },
    {
        key: '9',
        label: 'Тесты — классы эквивалентности',
        action: 'test-equiv',
    },
    { key: '0', label: 'Тесты — граничные значения', action: 'test-bnd' },
    { key: 'b', label: 'Тесты — ветвления', action: 'test-branch' },
    { key: 'c', label: 'Тесты — условия', action: 'test-cond' },
    { key: 'h', label: 'Справка (--help)', action: 'help' },
    { key: 'q', label: 'Выход', action: 'quit' },
];

export function printMenu() {
    NL();
    console.log(HR('─'));
    console.log(
        BOLD('  Интерактивное меню') +
        GRAY('  · введите цифру и нажмите Enter'),
    );
    console.log(HR('─'));
    MENU_ITEMS.forEach((item) => {
        const actions = item.action === 'quit' ? RED(item.key) : CYAN(item.key);
        console.log(`  ${BOLD(`[${actions}]`)}  ${item.label}`);
    });
    console.log(HR('─'));
}
