const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria a conexão com o banco de dados
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Desabilita logs de SQL no console
});

// Exporta a conexão
module.exports = sequelize;
