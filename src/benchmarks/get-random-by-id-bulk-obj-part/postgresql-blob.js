const {faker} = require('@faker-js/faker');

const {getConnection} = require('../../clients/postgresql');
const {runApp} = require('../../core/app');
const {FIELDS} = require('./constants');

runApp(async (app) => {
    const connection = await getConnection();

    app.get('/benchmark', async (request, reply) => {
        const productIds = Array.from({length: 100}, () =>
            faker.datatype.number({min: 1, max: 100000})
        );

        const [result] = await connection.query(
            `
            SELECT * FROM product WHERE entity_id IN (${productIds.join(',')});
        `
        );

        if (!result.length) {
            throw new Error('not found');
        }

        // @ts-ignore
        return result.map((row) =>
            FIELDS.reduce(
                (acc, field) => {
                    // @ts-ignore
                    acc[field] = row.value[field];

                    return acc;
                },
                {
                    // @ts-ignore
                    product_id: row.entity_id,
                }
            )
        );
    });
});
