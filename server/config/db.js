// ====================================================
// Database connection configuration
// ====================================================

const Sequelize = require('sequelize');
const settings  = require('./settings');

const database = new Sequelize(settings.database.name, settings.database.username, settings.database.password, {
  host: settings.database.host,
  port: settings.database.port,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
  benchmark: true,
  logging: false
});

module.exports = database;
