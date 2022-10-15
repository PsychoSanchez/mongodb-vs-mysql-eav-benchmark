const { fastify } = require('fastify');
const { faker } = require('@faker-js/faker');

const { getCollection } = require('../client/mongo');

faker.seed(123);

async function run() {
    try {
        const app = fastify({ logger: false });

        const collection = await getCollection();

        app.get('/product', async (request, reply) => {
            const productId = faker.datatype.number({ min: 1, max: 100000 });

            const cursor = collection.find({
                product_id: productId
            });
            const products = await cursor.toArray();

            return products;
        });

        app.listen({ port: 3000 }, (err, address) => {
            if (err) {
                app.log.error(err);
                process.exit(1);
            }
            app.log.info(`server listening on ${address}`);
        });

    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        process.send?.("ready");
    }
}

run().catch(console.dir);