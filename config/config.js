
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectModule: require('pg'),
    dialectOptions: { ssl: { require: true } },
  },
};