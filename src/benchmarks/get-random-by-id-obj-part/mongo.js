const {faker} = require('@faker-js/faker');

const {getCollection} = require('../../clients/mongo');
const {runApp} = require('../../core/app');
const {FIELDS} = require('./constants');

runApp(async (app) => {
    const collection = await getCollection();

    const projection = FIELDS.reduce((acc, field) => {
        // @ts-ignore
        acc[field] = 1;

        return acc;
    }, {});

    app.get('/benchmark', async (request, reply) => {
        const productId = faker.datatype.number({min: 1, max: 100000});

        const product = await collection.findOne(
            {
                product_id: productId,
            },
            {
                projection,
                limit: 1,
            }
        );

        return product;
    });
});
