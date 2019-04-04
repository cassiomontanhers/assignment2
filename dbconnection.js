const mysql = require('promise-mysql')

const config = {
    host: "awsendpoint.cpw3vvlmblxr.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "masterUser",
    password: "masterPass",
    database: "assignment2",
    connectionLimit: 100,
};

const pool = mysql.createPool(config);

module.exports = pool
