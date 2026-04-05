/* eslint-disable no-console */
import { BOLD, CYAN, DIM, GRAY, GREEN, HR, NL, WHITE, YELLOW } from '../tools';

// ШАПКА / СПРАВКА

export function printBanner() {
    NL();
    console.log(HR('═'));
    console.log(
        `  ${BOLD(CYAN('article-analyzer'))}${GRAY('  v1.0.0')}  ${WHITE(
            '·',
        )}  ${GRAY(`Node.js ${process.version}`)}`,
    );
    console.log(
        `  ${GRAY(
            'Анализ графа цитирования IT-статей  ·  ',
        )}${DIM('Пелля Р.Ю.')}`,
    );
    console.log(HR('═'));
}

export function printHelp() {
    printBanner();
    console.log(`${BOLD('Usage:')}  article-analyzer [options] <command>`);
    NL();

    console.log(BOLD('Commands:'));
    [
        ['  load <file>', 'Загрузить статьи из JSON-файла'],
        ['  build-graph', 'Построить граф цитирования'],
        [
            '  pagerank [method]',
            `Рассчитать PageRank  ${GRAY('(method: sparse | matrix)')}`,
        ],
        [
            '  cluster [method]',
            `Найти сообщества     ${GRAY('(louvain | kmeans)')}`,
        ],
        ['  compare-pagerank', 'Сравнить производительность двух методов'],
        ['  export <file>', 'Экспортировать результаты в JSON'],
        ['  report', 'Вывести итоговый отчёт в консоль'],
        [
            '  test [group]',
            `Запустить модульные тесты (Jest)  ${GRAY(
                '(group: all|equiv|boundary|branch|condition)',
            )}`,
        ],
    ].forEach(([cmd, desc]) => console.log(CYAN(cmd.padEnd(30)) + desc));
    NL();

    console.log(BOLD('Options:'));
    [
        ['-h, --help', 'Показать справку'],
        ['-v, --version', 'Показать версию'],
        ['--verbose', 'Подробный вывод'],
        ['--iter <n>', `Количество итераций  ${GRAY('(по умолч. 20)')}`],
        ['--damping <d>', `Коэффициент затухания  ${GRAY('(по умолч. 0.85)')}`],
    ].forEach(([opt, desc]) =>
        console.log(YELLOW(`  ${opt}`.padEnd(30)) + desc),
    );
    NL();

    console.log(BOLD('Examples:'));
    [
        'article-analyzer load data/articles.json',
        'article-analyzer pagerank sparse --iter 30',
        'article-analyzer pagerank matrix --damping 0.9',
        'article-analyzer compare-pagerank',
        'article-analyzer test all',
        'article-analyzer test boundary',
        'article-analyzer export results.json',
        'article-analyzer report',
    ].forEach((e) => console.log(GRAY('  $ ') + GREEN(e)));
    NL();
}
