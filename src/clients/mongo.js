
const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');

const uri = 'mongodb://admin:admin@localhost:27017/?maxPoolSize=20&w=majority';

const getCollection = async () => {
    const client = new MongoClient(uri, {
        connectTimeoutMS: 500000,
    });
    const connection = await client.connect();
    const database = connection.db('product');
    const collection = database.collection('product');

    return collection;
}

module.exports = {
    getCollection,
};