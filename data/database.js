const mysql = require('mysql2');
const dotenv = require('dotenv').config();

//a pool of reusable connections 
const pool = mysql.createPool({host: 'localhost', user: 'root', database: process.env.DB_NAME, password: process.env.DB_PASS }) //database refers to our schema name

module.exports = pool.promise();

