const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const basename = path.basename(__filename);

const models = {};

const database = require('../config/db');

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (!file.startsWith('.')) && (file !== basename) && (file.endsWith('.js'));
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(database, DataTypes);
    models[model.name] = model;
  });

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.database = database;
models.Sequelize = Sequelize;

module.exports = models;
