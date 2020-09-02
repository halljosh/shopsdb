const Sequelize = require('sequelize');
const dotenv = require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, 'root', process.env.DB_PASS, {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;

