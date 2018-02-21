const forceUpdate = require('../config/settings').database.forceUpdate;
const forceDatabaseUpdate = forceUpdate || !!process.env.FORCE_DB_UPDATE;

module.exports = (sequelize, DataTypes) => {
  const Credit = sequelize.define('Credit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: DataTypes.STRING,
    // JSON string with array of numbers
    terms: {
      type: DataTypes.JSON,
    },
    min_amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    max_amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    currency: {
      type: DataTypes.ENUM,
      values: ['BYN', 'USD'],
    },
    interest_rate: {
      type: DataTypes.DECIMAL(10, 2),
    },
    type: {
      type: DataTypes.ENUM,
      values: ['annuity', 'differentiated'],
    },
  }, {
    timestamps: false
  });

  return Credit.sync({ force: forceDatabaseUpdate })
  .then(() => Credit);
};
