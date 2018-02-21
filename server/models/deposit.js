const forceUpdate = require('../config/settings').database.forceUpdate;
const forceDatabaseUpdate = forceUpdate || !!process.env.FORCE_DB_UPDATE;

module.exports = (sequelize, DataTypes) => {
  const Deposit = sequelize.define('Deposit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    deposit_type_id: {
      type: DataTypes.INTEGER,
    },
    number: {
      type: DataTypes.INTEGER,
    },
    currency_type: {
      type: DataTypes.STRING,
    },
    start_date: {
      type: DataTypes.DATEONLY,
    },
    end_date: {
      type: DataTypes.DATEONLY,
    },
    term_in_month: {
      type: DataTypes.INTEGER,
    },
    start_balance: {
      type: DataTypes.DECIMAL(10, 2),
    },
    interest_rate: {
      type: DataTypes.FLOAT,
    },
    client_id: {
      type: DataTypes.INTEGER, // Reference to clients
      allowNull: true, // if null -> bank account
    },

    account_current_credit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    account_current_debet_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    account_percent_credit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    account_percent_debet_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
   timestamps: false
  });

  Deposit.associate = function(models) {
    this.belongsTo(models['DepositType'], {
      foreignKey: 'deposit_type_id',
      as: 'deposit_type'
    });
    this.belongsTo(models['Client'], {
      foreignKey: 'client_id',
      as: 'client'
    });

    this.belongsTo(models['Account'], {
      foreignKey: 'account_current_credit_id',
      as: 'account_current_credit'
    });
    this.belongsTo(models['CreditOrder'], {
      foreignKey: 'account_current_debet_id',
      as: 'account_current_debet'
    });
    this.belongsTo(models['CreditOrder'], {
      foreignKey: 'account_percent_credit_id',
      as: 'account_percent_credit'
    });
    this.belongsTo(models['CreditOrder'], {
      foreignKey: 'account_percent_debet_id',
      as: 'account_percent_debet'
    });
  };

  return Deposit.sync({ force: forceDatabaseUpdate })
  .then(() => Deposit);
};
