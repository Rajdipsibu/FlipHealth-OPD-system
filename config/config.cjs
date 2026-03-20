const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.resolve(__dirname, '../.env')});

module.exports = {
  "development": {
    "username": process.env.DB_USER || 'root',
    "password": process.env.DB_PASSWORD || '1234',
    "database": process.env.DB_NAME || 'fliphealth',
    "host": process.env.DB_HOST || 'localhost',
    "dialect": "mysql"
  }
};
