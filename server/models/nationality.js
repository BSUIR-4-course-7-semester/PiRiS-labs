const forceDatabaseUpdate = !!process.env.FORCE_DB_UPDATE;

module.exports = (sequelize, DataTypes) => {
  const Nationality = sequelize.define('Nationality', {
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

  return Nationality.sync({ force: forceDatabaseUpdate })
  .then(() => Nationality);
};
