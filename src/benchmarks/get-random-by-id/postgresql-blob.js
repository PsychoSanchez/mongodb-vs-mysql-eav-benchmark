const {faker} = require('@faker-js/faker');

const {getConnection} = require('../../clients/postgresql');
const {runApp} = require('../../core/app');

runApp(async (app) => {
    const connection = await getConnection();

    app.get('/benchmark', async (request, reply) => {
        const productId = faker.datatype.number({min: 1, max: 100000});

        const [result] = await connection.query(
            `
            SELECT * FROM product WHERE entity_id = ${productId};
        `
        );

        if (!result[0]) {
            throw new Error('not found');
        }

        // @ts-ignore
        return result[0].value;
    });
});
