const {faker} = require('@faker-js/faker');

const {getCollection} = require('../../clients/mongo');
const {runApp} = require('../../core/app');
const {FIELDS} = require('./constants');

runApp(async (app) => {
    const collection = await getCollection();

    app.get('/benchmark', async (request, reply) => {
        const productId = faker.datatype.number({min: 1, max: 100000});

        const product = await collection.findOne(
            {
                product_id: productId,
            },
            {
                limit: 1,
            }
        );

        return FIELDS.reduce((acc, field) => {
            // @ts-ignore
            acc[field] = product[field];

            return acc;
        }, {});
    });
});
