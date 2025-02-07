const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;
