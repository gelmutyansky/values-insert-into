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

/**
 * Функция, отдающая VALUES строку для INSERT INTO. Версия 2
 * @param {Number} paramsLength - общее количество параметров в массиве
 * @param {Number} allColumns - общее количество колонок, в которые вставляем значения
 * @param {Number} constantParamsLength - количество констант в начале
 */
function valuesInsertIntoV2(paramsLength, allColumns, constantParamsLength = 0){
    const divider = allColumns - constantParamsLength

    let num = 1 + constantParamsLength;
    const cycles = (paramsLength - constantParamsLength) / divider;
    let res = [];
    for (let i = 1; i <= cycles; i++) {
        let str = `(`;
        let dollars = [];

        for (let con = 1; con <= constantParamsLength; con++) {
            dollars.push(`$${ con }`);
        }

        for (; num <= (divider * i) + constantParamsLength; num++) {
            dollars.push(`$${ num }`);
        }

        str += dollars.join() + `)`;

        res.push(str);
    }

    return res.join();
}
