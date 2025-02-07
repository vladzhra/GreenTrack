const sequelize = require('../config/sequelize');
const User = require('./User');
const Bin = require('./Bin');

async function initModels() {
    try {
        await sequelize.sync({ alter: true });
        console.log('🔄 Base de données synchronisée avec les modèles.');

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des modèles:', error);
    }
}

module.exports = {
    sequelize,
    User,
    Bin,
    initModels
};
