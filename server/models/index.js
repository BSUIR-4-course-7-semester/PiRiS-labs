const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const basename = path.basename(__filename);

const models = {};

const database = require('../config/db');

Promise.all(
  fs
  .readdirSync(__dirname)
  .filter(file => (!file.startsWith('.')) &&
                  (file !== basename) &&
                  (file.endsWith('.js')))
  .map(file => require(path.join(__dirname, file))(database, DataTypes))
)
.then(items => {
  items.forEach(model => models[model.name] = model);
})
.then(() => {
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
});

models.database = database;
models.Sequelize = Sequelize;

module.exports = () => models;
