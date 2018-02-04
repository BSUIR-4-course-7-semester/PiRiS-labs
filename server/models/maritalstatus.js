
module.exports = (sequelize, DataTypes) => {
  const MaritalStatus = sequelize.define('MaritalStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING
  });

  return MaritalStatus;
};
