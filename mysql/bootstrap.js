const { createDataset } = require('../dataset/index.js');
const lodash = require('lodash');
const sequelize = require('sequelize');

/**
 * @param {unknown} value
 */
function getValueType(value) {
    if (typeof value === 'string') {
        if (value.length > 255) {
            return 'text';
        }

        return 'string';
    }

    if (typeof value === 'number') {
        return Number.isInteger(value) ? 'int' : 'float';
    }

    if (typeof value === 'boolean') {
        return 'boolean';
    }

    if (value instanceof Date) {
        return 'timestamp';
    }

    return 'string';
}

/**
 * @param {{ [s: string]: any; }} product
 */
function productToRow(product) {
    const productId = product.product_id;
    return Object.entries(product).map(([key, value]) => {
        const type = getValueType(value);

        return {
            entity_id: productId,
            attribute_id: key,
            type,
            value_boolean: null,
            value_int: null,
            value_float: null,
            value_bigint_unsigned: null,
            value_timestamp: null,
            value_string: null,
            value_text: null,
            [`value_${type}`]: value
        };
    });
}

const sequelizeClient = new sequelize.Sequelize('product', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Product = sequelizeClient.define('entity_attribute_value', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    entity_id: {
        type: sequelize.DataTypes.INTEGER,
    },
    attribute_id: {
        type: sequelize.DataTypes.STRING,
    },
    type: {
        type: sequelize.DataTypes.STRING,
    },
    value_boolean: {
        type: sequelize.DataTypes.BOOLEAN,
    },
    value_int: {
        type: sequelize.DataTypes.INTEGER,
    },
    value_float: {
        type: sequelize.DataTypes.FLOAT,
    },
    value_bigint_unsigned: {
        type: sequelize.DataTypes.BIGINT,
    },
    value_timestamp: {
        type: sequelize.DataTypes.DATE,
    },
    value_string: {
        type: sequelize.DataTypes.STRING,
    },
    value_text: {
        type: sequelize.DataTypes.TEXT,
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'entity_attribute_value',
});

async function run() {
    // wait for the database to be ready
    await sequelizeClient.authenticate();

    await sequelizeClient.sync();

    const time = Date.now();
    let id = 0;
    for (let i = 0; i < 100; i++) {
        const products = lodash.times(1000, () => createDataset(++id));
        const rows = products.flatMap(productToRow);

        await Product.bulkCreate(rows);

        console.log(`Inserted ${id} products`);
    }
    console.log(`Inserted ${id} products in ${Date.now() - time}ms`);
}

run().catch(console.dir);