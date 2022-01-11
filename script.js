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

/**
 * Кастомная генерация строк с join
 * @param {Array} array - массив строк
 * @param {string} join - разделение
 * @param {string} beginEnd - в начале, конце и между
 *
 * array = [1,2,3]; join = `, `; beginEnd = `"` => "1", "2", "3"
 * Удобно для генерации колонок в INSERT INTO
*/
function customJoin(array, join, beginEnd){
    return beginEnd + array.join(beginEnd + join + beginEnd) + beginEnd;
}

function example(billIncomeType, projectId, profileIdCustomer, innCustomer, organisationCustomer, resNPDS) {
    const columns = [ `billIncomeType`, `projectId`, `profileIdCustomer`, `innCustomer`, `organisationCustomer` ]; // столбцы-константы
    const paramsInsertBills = [ billIncomeType, projectId, profileIdCustomer, innCustomer, organisationCustomer ]; // значения-константы, которые не меняются
    const constParams = paramsInsertBills.length; // можно заменить и на columns.length. Количество констант

    columns.push(`profileId`, `inn`, `billList`, `total`, `userId`); // динамичные столбцы

    for (const npd of resNPDS.rows) {
        // ...
        // закидываем параметры в соответствии с названиями динамичных столбцов выше
        paramsInsertBills.push(npd.profileId, npd.inn, JSON.stringify(services), npd.income, npd.userId);
    }
    
    const queryInsertBills = `INSERT INTO npdbills (` + helpers.customJoin(columns, ', ', '"') + ') VALUES ' + helpers.valuesInsertIntoV2(paramsInsertBills.length, columns.length, constParams) + ' RETURNING id';
    const resInsertBills = await client.query(queryInsertBills, paramsInsertBills);
}
