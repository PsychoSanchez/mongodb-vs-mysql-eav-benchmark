const {faker} = require('@faker-js/faker');
const {escape} = require('mysql2/promise');

const {getPool} = require('../../clients/mysql');
const {runApp} = require('../../core/app');
const {FIELDS} = require('./constants');

runApp(async (app) => {
    const connection = await getPool(3308);

    app.get('/benchmark', async (request, reply) => {
        const productIds = Array.from({length: 100}, () =>
            faker.datatype.number({min: 1, max: 100000})
        );

        const [rows] = await connection.execute(
            `SELECT * FROM entity_attribute_value WHERE entity_id IN (${productIds.join(
                ','
            )}) AND attribute_id IN (${FIELDS.map((field) =>
                escape(field)
            ).join(', ')});`,
            []
        );

        return Object.values(
            // @ts-ignore
            rows.reduce((acc, row) => {
                const {
                    entity_id,
                    attribute_id,
                    value_boolean,
                    value_int,
                    value_float,
                    value_bigint_unsigned,
                    value_timestamp,
                    value_string,
                    value_text,
                } = row;

                acc[entity_id] = acc[entity_id] || {};
                acc[entity_id][attribute_id] =
                    value_boolean ||
                    value_int ||
                    value_float ||
                    value_bigint_unsigned ||
                    value_timestamp ||
                    value_string ||
                    value_text;

                return acc;
            }, {})
        );
    });
});
