const forceDatabaseUpdate = !!process.env.FORCE_DB_UPDATE;

module.exports = (sequelize, DataTypes) => {
  const CurrencyType = sequelize.define('CurrencyType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    }
  }, {
    timestamps: false
  });

  return CurrencyType.sync({ force: forceDatabaseUpdate })
  .then(() => CurrencyType);
};
