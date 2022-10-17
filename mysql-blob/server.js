const { fastify } = require('fastify');

const { faker } = require('@faker-js/faker');
const { getPool } = require('../client/mysql');

faker.seed(123);

async function run() {
    try {
        const app = fastify({ logger: false });

        const connection = await getPool(3307)

        app.get('/product', async (request, reply) => {
            const productId = faker.datatype.number({ min: 1, max: 100000 });

            const [rows] = await connection.execute(`
                SELECT * FROM entity_attribute_value WHERE entity_id = ?;
            `, [productId]);

            if (!rows[0]) {
                throw new Error('not found');
            }

            return rows[0].value;
        });

        app.listen({ port: 3000 }, (err, address) => {
            if (err) {
                app.log.error(err);
                process.exit(1);
            }
            app.log.info(`server listening on ${address}`);
        });
    } catch (err) {
        throw err;
    } finally {
        process.send?.("ready");
    }
}

run().catch(console.dir);
