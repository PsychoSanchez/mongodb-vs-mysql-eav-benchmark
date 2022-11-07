const {faker} = require('@faker-js/faker');

const {getCollection} = require('../../clients/mongo');
const {runApp} = require('../../core/app');

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

        return product;
    });
});
