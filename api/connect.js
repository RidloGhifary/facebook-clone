const mysql = require("mysql");
const dotenv = require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.REACT_APP_HOST,
  user: process.env.REACT_APP_ROOT,
  password: process.env.REACT_APP_PASSWORD,
  database: process.env.REACT_APP_DATABASE,
});

module.exports = db;
