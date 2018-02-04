
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    patronymic: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    passport_series: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    passport_number: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    passport_reducer: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    passport_reducing_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    identification_number: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    birth_place: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    actual_residence_city_id: {
      type: DataTypes.INTEGER,  //  reference to city table
      allowNull: false,
    },
    actual_address: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    home_tel_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    mobile_tel_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    job_place: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    job_position: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    registration_address: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    marital_status_id: {
      type: DataTypes.INTEGER,  //  reference to marital_status table
      allowNull: false,
    },
    nationality_id: {
      type: DataTypes.INTEGER,  //  reference to nationality table
      allowNull: false,
    },
    disability_id: {
      type: DataTypes.INTEGER,  //  reference to disability table
      allowNull: false,
    },
    pensioner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    monthly_revenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    }
  });

  Client.associate = function(models) {
    this.belongsTo(models['MaritalStatus'], {
      foreignKey: 'marital_status_id'
    });
  };

  Client.sync();

  return Client;
};
