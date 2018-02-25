const forceUpdate = require('../config/settings').database.forceUpdate;
const forceDatabaseUpdate = forceUpdate || !!process.env.FORCE_DB_UPDATE;
const Sequelize = require('sequelize');

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
    month_passed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    start_balance: {
      type: DataTypes.DECIMAL(10, 2),
      get() {
        return parseFloat(this.getDataValue('start_balance'))
      }
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
    account_current_debit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    account_percent_credit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    account_percent_debit_id: {
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
    this.belongsTo(models['Account'], {
      foreignKey: 'account_current_debit_id',
      as: 'account_current_debit'
    });
    this.belongsTo(models['Account'], {
      foreignKey: 'account_percent_credit_id',
      as: 'account_percent_credit'
    });
    this.belongsTo(models['Account'], {
      foreignKey: 'account_percent_debit_id',
      as: 'account_percent_debit'
    });
  };

  Deposit.findActiveDeposits = function() {
    return this.findAll({
      where: {
        month_passed: {
          $lt: Sequelize.col('Deposit.term_in_month')
        }
      },
      include: [{ all: true }]
    });
  };

  Deposit.prototype.incPassedMonth = function () {
    this.month_passed += 1;
    return this.save();
  };

  return Deposit.sync({ force: forceDatabaseUpdate })
  .then(() => Deposit);
};
