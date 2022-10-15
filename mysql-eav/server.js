const { fastify } = require('fastify');

const { faker } = require('@faker-js/faker');
const { getPool } = require('../client/mysql');

faker.seed(123);

async function run() {
    try {
        const app = fastify({ logger: false });

        const connection = await getPool()

        app.get('/product', async (request, reply) => {
            const productId = faker.datatype.number({ min: 1, max: 100000 });


            const [rows] = await connection.execute(`
                SELECT * FROM entity_attribute_value WHERE entity_id = ?;
            `, [productId]);

            return rows.reduce((acc, row) => {
                const { entity_id, attribute_id, type, value_boolean, value_int, value_float, value_bigint_unsigned, value_timestamp, value_string, value_text } = row;

                acc[attribute_id] = value_boolean || value_int || value_float || value_bigint_unsigned || value_timestamp || value_string || value_text;

                return acc;
            }, {});

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