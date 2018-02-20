const forceUpdate = require('../config/settings').database.forceUpdate;
const forceDatabaseUpdate = forceUpdate || !!process.env.FORCE_DB_UPDATE;

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
    },
    account_code: {
      type: DataTypes.STRING,
    },
    activity: {
      type: DataTypes.ENUM(['active', 'passive', 'active-passive']),
    },
    type: {
      type: DataTypes.ENUM(['debit', 'credit', 'balance']),
    },
    name: {
      type: DataTypes.STRING,
    },
    currency_type: {
      type: DataTypes.STRING,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
    },
    client_id: {
      type: DataTypes.INTEGER, // Reference to clients
      allowNull: true, // if null -> bank account
    }
  }, {
    timestamps: false
  });

  Account.associate = function(models) {
    this.belongsTo(models['Client'], {
      foreignKey: 'client_id',
      as: 'client'
    });
  };

  return Account.sync({ force: forceDatabaseUpdate })
  .then(() => Account);
};
