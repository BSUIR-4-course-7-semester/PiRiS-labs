
module.exports = (sequelize, DataTypes) => {
  const MaritalStatus = sequelize.define('MaritalStatus', {
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

  return MaritalStatus.sync()
  .then(() => MaritalStatus);
};
