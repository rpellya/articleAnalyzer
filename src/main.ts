/**
 * article-analyzer — консольное приложение для анализа графа цитирования IT-статей.
 * Пелля Р.Ю.
 *
 * Требования:
 *  -  Node.js v20.19.0
 *
 * Запуск:
 *   npx tsx src/main.ts <- интерактивное меню
 *   npx tsx src/main.ts [command] [options]
 *
 *   npx jest src/app/__tests__/  --coverage
 *
 * Для запуска мутационного тестирования:
 * npx stryker run --mutate "json-server/article-analyzer/app/algorithm/**!/*.ts" --incremental
 */

import path from 'path';
import readline from 'readline';
import { cmdBuildGraph } from './app/commands/buildGraph';
import { cmdLoad } from './app/commands/cmdLoad';
import { cmdCompare } from './app/commands/compare';
import { cmdExport } from './app/commands/export';
import { cmdTest } from './app/commands/launchTest';
import { cmdPageRank } from './app/commands/rageRank';
import { cmdReport } from './app/commands/report';
import { printBanner, printHelp } from './app/print/help';
import { MENU_ITEMS, printMenu } from './app/print/menu';
import { BOLD, CYAN, GRAY, RED, YELLOW } from './app/tools';

// ИНТЕРАКТИВНОЕ МЕНЮ (readline, без зависимостей)

(function main() {
    async function runMenu(iter: number, damping: number) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const ask = (q: string) =>
            new Promise((res) => {
                rl.question(q, res);
            });

        printBanner();
        printMenu();

        const loop = async () => {
            const answer: string = String(await ask(GRAY('\n  > ')));
            const item = MENU_ITEMS.find((m) => m.key === answer);

            if (!item) {
                console.log(
                    YELLOW('  Неизвестная команда: ') +
                    answer +
                    GRAY('  (введите h для справки)'),
                );
                return loop();
            }

            try {
                if (item.action === 'load') {
                    const fp =
                        String(
                            await ask(
                                GRAY(
                                    '  Путь к JSON-файлу [mock/articles.json]: ',
                                ),
                            ),
                        ) ||
                        path.join(__dirname, 'app', 'mock', 'articles.json');
                    cmdLoad(fp);
                }
                if (item.action === 'build-graph') {
                    cmdBuildGraph();
                }
                if (item.action === 'pr-sparse') {
                    cmdPageRank('sparse', iter, damping);
                }
                if (item.action === 'pr-matrix') {
                    cmdPageRank('matrix', iter, damping);
                }
                if (item.action === 'compare') {
                    cmdCompare(iter, damping);
                }
                if (item.action === 'report') {
                    cmdReport();
                }
                if (item.action === 'export') {
                    const fp: string =
                        String(
                            await ask(GRAY('  Имя файла [results.json]: ')),
                        ) || 'results.json';
                    cmdExport(fp, iter, damping);
                }
                if (item.action === 'test-all') {
                    cmdTest('all', false);
                }
                if (item.action === 'test-equiv') {
                    cmdTest('equiv', false);
                }
                if (item.action === 'test-bnd') {
                    cmdTest('boundary', false);
                }
                if (item.action === 'test-branch') {
                    cmdTest('branch', false);
                }
                if (item.action === 'test-cond') {
                    cmdTest('condition', false);
                }
                if (item.action === 'help') {
                    printHelp();
                }
                if (item.action === 'quit') {
                    console.log(GRAY('\n  До свидания!\n'));
                    return rl.close();
                }
            } catch (e: any) {
                console.log(RED('  Ошибка: ') + e.message);
            }

            printMenu();
            return loop();
        };

        await loop();
    }

    // ТОЧКА ВХОДА — парсинг аргументов

    const argv = process.argv.slice(2);
    const getOpt = (name: string, def: string) => {
        const i = argv.indexOf(name);
        return i !== -1 && argv[i + 1] ? argv[i + 1] : def;
    };
    const hasFlag = (name: string) => argv.includes(name);

    const iter: number = parseInt(getOpt('--iter', '20'), 10);
    const damping: number = parseFloat(getOpt('--damping', '0.85'));
    const verbose: boolean = hasFlag('--verbose') || hasFlag('-v');

    const cmd = argv.find((a) => !a.startsWith('-'));
    const rest: string[] = argv.filter((a) => !a.startsWith('-') && a !== cmd);

    if (!cmd) {
        runMenu(iter, damping).catch((e) => {
            console.error(e);
            process.exit(1);
        });
        return;
    }

    // С аргументами -> прямой вызов команды
    printBanner();
    try {
        if (cmd === 'help') {
            printHelp();
        } else if (cmd === 'version') {
            console.log(BOLD('  article-analyzer ') + CYAN('v1.0.0'));
        } else if (cmd === 'load') {
            if (!rest[0]) {
                console.log(RED('  Укажите файл'));
                process.exit(1);
            }
            cmdLoad(String(rest[0]));
        } else if (cmd === 'build-graph') {
            cmdBuildGraph();
        } else if (cmd === 'pagerank') {
            cmdPageRank(rest[0] || 'sparse', iter, damping);
        } else if (cmd === 'compare-pagerank') {
            cmdCompare(iter, damping);
        } else if (cmd === 'report') {
            cmdReport();
        } else if (cmd === 'export') {
            if (!rest[0]) {
                console.log(RED('  Укажите имя выходного файла'));
                process.exit(1);
            }
            cmdExport(String(rest[0]), iter, damping);
        } else if (cmd === 'test') {
            cmdTest(rest[0] || 'all', verbose);
        } else {
            console.log(RED('  [105] Неизвестная команда: ') + BOLD(cmd || ''));
            console.log(GRAY('  Используйте help для справки'));
            process.exit(1);
        }
    } catch (e: any) {
        console.log(RED('  Ошибка: ') + e.message);
        if (verbose) console.error(e.stack);
        process.exit(1);
    }
})();
