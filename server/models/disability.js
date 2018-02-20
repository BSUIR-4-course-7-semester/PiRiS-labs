const forceUpdate = require('../config/settings').database.forceUpdate;
const forceDatabaseUpdate = forceUpdate || !!process.env.FORCE_DB_UPDATE;

module.exports = (sequelize, DataTypes) => {
  const Disability = sequelize.define('Disability', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: DataTypes.STRING
  }, {
    timestamps: false
  });

  return Disability.sync({ force: forceDatabaseUpdate })
  .then(() => Disability);
};
