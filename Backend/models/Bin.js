const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Bin = sequelize.define('Bin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fillLevel: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        validate: {
            min: 0,
            max: 100,
        },
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'bins',
});

module.exports = Bin;
