const forceUpdate = require('../config/settings').database.forceUpdate;
const forceDatabaseUpdate = forceUpdate || !!process.env.FORCE_DB_UPDATE;
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const CreditOrder = sequelize.define('CreditOrder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    credit_id: {
      type: DataTypes.INTEGER,
    },
    number: {
      type: DataTypes.INTEGER,
    },
    currency: {
      type: DataTypes.STRING,
    },
    begin_date: {
      type: DataTypes.DATEONLY,
    },
    end_date: {
      type: DataTypes.DATEONLY,
    },
    term: {
      type: DataTypes.INTEGER,
    },
    month_passed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    amount: {
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

  CreditOrder.associate = function(models) {
    this.belongsTo(models['Credit'], {
      foreignKey: 'credit_id',
      as: 'credit'
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

  CreditOrder.findActiveCredits = function() {
    return this.findAll({
      where: {
        month_passed: {
          $lt: Sequelize.col('CreditOrder.term')
        }
      },
      include: [{ all: true }]
    });
  };

  CreditOrder.prototype.incPassedMonth = function () {
    this.month_passed += 1;
    return this.save();
  };

  return CreditOrder.sync({ force: forceDatabaseUpdate })
  .then(() => CreditOrder);
};
