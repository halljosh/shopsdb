const Sequelize = require('sequelize');

const sequelize = require('../data/database');

const OrderItem = sequelize.define('order-item', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = OrderItem;