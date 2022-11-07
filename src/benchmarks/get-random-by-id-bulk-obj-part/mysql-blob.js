const {faker} = require('@faker-js/faker');

const {getPool} = require('../../clients/mysql');
const {runApp} = require('../../core/app');
const {FIELDS} = require('./constants');

runApp(async (app) => {
    const connection = await getPool(3307);

    app.get('/benchmark', async (request, reply) => {
        const productIds = Array.from({length: 100}, () =>
            faker.datatype.number({min: 1, max: 100000})
        );

        const [rows] = await connection.execute(
            `
            SELECT * FROM entity_attribute_value WHERE entity_id IN (${productIds.join(
                ','
            )});`,
            []
        );

        // @ts-ignore
        return rows.map((row) =>
            FIELDS.reduce(
                (acc, field) => {
                    // @ts-ignore
                    acc[field] = row.value[field];

                    return acc;
                },
                {
                    product_id: row.entity_id,
                }
            )
        );
    });
});
