/**
 * Функция, отдающая VALUES строку для INSERT INTO
 * numOfValues - общее количество параметров
 * divider - количество уникальных параметров в скобке без учета константы. Например, ($1, $2, $3, $4), ($1, $2, $5, $6) -- тут их 2
 * (numOfValues - constant) должно нацело делиться на divider
 */
function valuesInsertInto(numOfValues, divider, constant = 0) {
    let num = 1 + constant;
    const cycles = (numOfValues - constant) / divider;
    let res = [];
    for (let i = 1; i <= cycles; i++) {
        let str = `(`;
        let dollars = [];

        for (let con = 1; con <= constant; con++) {
            dollars.push(`$${ con }`);
        }

        for (; num <= (divider * i) + constant; num++) {
            dollars.push(`$${ num }`);
        }

        str += dollars.join() + `)`;

        res.push(str);
    }

    return res.join();
}