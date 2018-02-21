const forceUpdate = require('../config/settings').database.forceUpdate;
const forceDatabaseUpdate = forceUpdate || !!process.env.FORCE_DB_UPDATE;

module.exports = (sequelize, DataTypes) => {
  const DepositType = sequelize.define('DepositType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(['call', 'time']),
    },
    name: {
      type: DataTypes.STRING,
    },
    term_in_month: { // Срок вклада
      type: DataTypes.SMALLINT,
    },
    interest_rate: {
      type: DataTypes.FLOAT,
    },
    // interestRateType: {   // Тип процентной ставки(unused)
    //   type: DataTypes.ENUM()
    // }
    payment: {
      type: DataTypes.ENUM(['monthly', 'capitalization']),
    },
    early_repayment: {
      type: DataTypes.BOOLEAN
    },
    currency_type: {
      type: DataTypes.STRING,
    },
    min_contribution: {
      type: DataTypes.DECIMAL(10, 2),
    }
  }, {
    timestamps: false
  });

  return DepositType.sync({ force: forceDatabaseUpdate })
  .then(() => DepositType);
};
