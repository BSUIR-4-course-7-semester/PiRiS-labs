
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    surname: DataTypes.STRING,
    first_name: DataTypes.STRING,
    patronymic: DataTypes.STRING
  });

  Client.associate = function(models) {
    this.belongsTo(models['MaritalStatus']);
  };

  return Client;
};
