const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bin = sequelize.define('Bin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fillLevel: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    location: {
        type: DataTypes.GEOGRAPHY, // For spatial data
        allowNull: false,
    },
}, { timestamps: true });

module.exports = Bin;
