import { normalizeByColumn } from './utils';

export const T = [
    ['Азербайджан', 28.2, 70.5],
    ['Армения', 17.1, 70.4],
    ['Беларусь', 12.5, 70.3],
    ['Казахстан', 28.4, 68.6],
    ['Кыргызстан', 31.8, 68.8],
    ['Молдова', 21.5, 67.7],
    ['Россия', 20, 69],
    ['Таджикистан', 42.7, 70.5],
    ['Туркмения', 45.9, 65.3],
    ['Узбекистан', 35.6, 69.3],
    ['Украина', 14.9, 70.5],
    ['Грузия', 18.3, 72.6],
    ['Латвия', 15.9, 69.2],
    ['Литва', 15.2, 70.7],
    ['Эстония', 15.7, 70],
];

export const U = normalizeByColumn([
    [71, 17.1, 12.2],
    [72, 17, 12],
    [74, 18, 13],
    [76, 16.5, 10.5],
    [75, 16.3, 11],
    [70, 17.6, 12.8],
    [73, 17.8, 13.1],
    [75, 17.7, 13.2],
    [72, 17.5, 13.4],
    [76, 18, 13.5],
]);

console.log(U);