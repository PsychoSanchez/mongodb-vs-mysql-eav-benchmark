const {faker} = require('@faker-js/faker');

const {getPool} = require('../../clients/mysql');
const {runApp} = require('../../core/app');

runApp(async (app) => {
    const connection = await getPool(3308);

    app.get('/benchmark', async (request, reply) => {
        const productId = faker.datatype.number({min: 1, max: 100000});

        const [rows] = await connection.execute(
            `
            SELECT * FROM entity_attribute_value WHERE entity_id = ?;
        `,
            [productId]
        );

        // @ts-ignore
        return rows.reduce((acc, row) => {
            const {
                attribute_id,
                value_boolean,
                value_int,
                value_float,
                value_bigint_unsigned,
                value_timestamp,
                value_string,
                value_text,
            } = row;

            acc[attribute_id] =
                value_boolean ||
                value_int ||
                value_float ||
                value_bigint_unsigned ||
                value_timestamp ||
                value_string ||
                value_text;

            return acc;
        }, {});
    });
});
