const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nom de la base de données
  process.env.DB_USER,     // Nom d'utilisateur PostgreSQL
  process.env.DB_PASSWORD, // Mot de passe
  {
    host: process.env.DB_HOST || '127.0.0.1', // Adresse de la base de données
    dialect: 'postgres',        // Type de base de données
    port: process.env.DB_PORT,  // Port PostgreSQL
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed', error);
  }
};

module.exports = { connectDB, sequelize };
