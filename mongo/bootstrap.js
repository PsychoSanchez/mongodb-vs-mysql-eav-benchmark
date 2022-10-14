const { MongoClient } = require('mongodb');
const lodash = require('lodash');

const { createDataset } = require('../dataset/index.js');

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri, {
    auth: {
        password: 'admin',
        username: 'admin',
    }
});

async function run() {
    try {
        await client.connect();

        const database = client.db('product');
        const collection = database.collection('product');
        await collection.createIndex({ product_id: 1 }, { unique: true });

        // this option prevents additional documents from being inserted if one fails
        const options = { ordered: true };

        const time = Date.now();

        let id = 0;
        for (let i = 0; i < 100; i++) {
            const products = lodash.times(1000, () => createDataset(++id));
            await collection.insertMany(products, options);
            console.log(`Inserted ${id} products`);
        }

        console.log(`Inserted ${id} products in ${Date.now() - time}ms`);

    } finally {
        await client.close();
    }


}

run().catch(console.dir);

