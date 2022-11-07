const sequelize = require('sequelize');

const getConnection = async () => {
    const connection = new sequelize.Sequelize(
        'postgres',
        'postgres',
        'postgres',
        {
            host: 'localhost',
            dialect: 'postgres',
            port: 5432,
            logging: false,
            pool: {
                max: 20,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        }
    );

    return connection;
};

module.exports = {
    getConnection,
};
