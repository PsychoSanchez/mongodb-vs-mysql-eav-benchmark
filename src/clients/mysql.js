const mysql = require('mysql2/promise');

const getPool = async (/** @type {number} */ port) => {
    const connection = mysql.createPool({
        host: 'localhost',
        port,
        user: 'admin',
        password: 'admin',
        database: 'product',
        waitForConnections: true,
        connectionLimit: 15,
    });

    return connection;
};

module.exports = {
    getPool,
};
