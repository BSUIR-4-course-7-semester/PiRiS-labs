const database = require('../../config/db').database;
const sequelize = require('sequelize');

const TestSchema = database.define('test', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: sequelize.STRING(45),
  },
}, {
  timestamps: false,
  instanceMethods: {}
});

TestSchema.sync({});

module.exports = TestSchema;
