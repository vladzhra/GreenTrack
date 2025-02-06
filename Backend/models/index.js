const sequelize = require('../config/sequelize');
const User = require('./User');
const Bin = require('./Bin');

async function initModels() {
    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ alter: true });
    console.log('Base de données synchronisée');
}

module.exports = {
    sequelize,
    User,
    Bin,
    initModels
};
