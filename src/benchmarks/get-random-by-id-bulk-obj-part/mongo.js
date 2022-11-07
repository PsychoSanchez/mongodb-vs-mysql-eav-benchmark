const {faker} = require('@faker-js/faker');

const {getCollection} = require('../../clients/mongo');
const {runApp} = require('../../core/app');

const {FIELDS} = require('./constants');

runApp(async (app) => {
    const collection = await getCollection();

    app.get('/benchmark', async (request, reply) => {
        const productIds = Array.from({length: 100}, () =>
            faker.datatype.number({min: 1, max: 100000})
        );

        const cursor = collection.find({
            product_id: {
                $in: productIds,
            },
        });

        return (await cursor.toArray()).map((product) => {
            return FIELDS.reduce((acc, field) => {
                // @ts-ignore
                acc[field] = product[field];

                return acc;
            }, {});
        });
    });
});
