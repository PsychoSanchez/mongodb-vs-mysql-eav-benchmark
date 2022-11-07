const {createDataset} = require('../../dataset/index.js');
const lodash = require('lodash');
const sequelize = require('sequelize');

const sequelizeClient = new sequelize.Sequelize('product', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3307,
    logging: false,
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

const Product = sequelizeClient.define(
    'entity_attribute_value',
    {
        id: {
            type: sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        entity_id: {
            type: sequelize.DataTypes.INTEGER,
        },
        value: {
            type: sequelize.DataTypes.JSON,
        },
    },
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'entity_attribute_value',
    }
);

/**
 * @param {{ product_id: any; }} product
 */
function productToRow(product) {
    return {
        entity_id: product.product_id,
        value: product,
    };
}

async function run() {
    // wait for 10 seconds to allow the database to start
    await new Promise((resolve) => setTimeout(resolve, 10000));

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

    return Date.now() - time;
}

module.exports = run;
