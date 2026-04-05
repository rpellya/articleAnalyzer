/* eslint-disable no-console */
// ANSI-ЦВЕТА (без внешних зависимостей)
export const R = '\x1b[0m';
export const BOLD = (s: string | number) => `\x1b[1m${s}${R}`;
export const DIM = (s: string) => `\x1b[2m${s}${R}`;
export const RED = (s: string) => `\x1b[31m${s}${R}`;
export const GREEN = (s: string) => `\x1b[32m${s}${R}`;
export const YELLOW = (s: string) => `\x1b[33m${s}${R}`;
export const BLUE = (s: string) => `\x1b[34m${s}${R}`;
export const MAGENTA = (s: string) => `\x1b[35m${s}${R}`;
export const CYAN = (s: string) => `\x1b[36m${s}${R}`;
export const GRAY = (s: string) => `\x1b[90m${s}${R}`;
export const WHITE = (s: string) => `\x1b[37m${s}${R}`;

export const HR = (ch = '─', n = 74) => GRAY(ch.repeat(n));
export const NL = () => console.log('');
