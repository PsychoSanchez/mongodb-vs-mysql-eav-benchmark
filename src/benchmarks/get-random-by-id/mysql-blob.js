const {faker} = require('@faker-js/faker');

const {getPool} = require('../../clients/mysql');
const {runApp} = require('../../core/app');

runApp(async (app) => {
    const connection = await getPool(3307);

    app.get('/benchmark', async (request, reply) => {
        const productId = faker.datatype.number({min: 1, max: 100000});

        const [rows] = await connection.execute(
            `
            SELECT * FROM entity_attribute_value WHERE entity_id = ?;
        `,
            [productId]
        );

        // @ts-ignore
        if (!rows[0]) {
            throw new Error('not found');
        }

        // @ts-ignore
        return rows[0].value;
    });
});
