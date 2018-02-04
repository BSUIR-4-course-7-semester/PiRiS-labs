const database = require('../../config/db').database;
const sequelize = require('sequelize');

const ClientSchema = database.define('client', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  surname: {
    type: sequelize.STRING(200),
    allowNull: false,
  },
  first_name: {
    type: sequelize.STRING(200),
    allowNull: false,
  },
  patronymic: {
    type: sequelize.STRING(200),
    allowNull: false,
  },
  birth_date: {
    type: sequelize.DataTypes.DATEONLY,
    allowNull: false,
  },
  passport_series: {
    type: sequelize.STRING(2),
    allowNull: false,
  },
  passport_number: {
    type: sequelize.STRING(7),
    allowNull: false,
  },
  passport_reducer: {
    type: sequelize.STRING(300),
    allowNull: false,
  },
  passport_reducing_date: {
    type: sequelize.DataTypes.DATEONLY,
    allowNull: false,
  },
  identification_number: {
    type: sequelize.STRING(14),
    allowNull: false,
  },
  birth_place: {
    type: sequelize.STRING(300),
    allowNull: false,
  },
  actual_residence_city: {
    type: sequelize.INTEGER,  //  reference to city table
    allowNull: false,
  },
  actual_address: {
    type: sequelize.STRING(300),
    allowNull: false,
  },
  home_tel_number: {
    type: sequelize.STRING(20),
    allowNull: true,
  },
  mobile_tel_number: {
    type: sequelize.STRING(20),
    allowNull: true,
  },
  email: {
    type: sequelize.STRING(200),
    allowNull: true,
  },
  job_place: {
    type: sequelize.STRING(200),
    allowNull: true,
  },
  job_position: {
    type: sequelize.STRING(100),
    allowNull: true,
  },
  registration_address: {
    type: sequelize.STRING(300),
    allowNull: false,
  },
  marital_status: {
    type: sequelize.INTEGER,  //  reference to marital_status table
    allowNull: false,
  },
  nationality: {
    type: sequelize.INTEGER,  //  reference to nationality table
    allowNull: false,
  },
  disability: {
    type: sequelize.INTEGER,  //  reference to disability table
    allowNull: false,
  },
  pensioner: {
    type: sequelize.BOOLEAN,
    allowNull: false,
  },
  monthly_revenue: {
    type: sequelize.DataTypes.DECIMAL(10, 2),
    allowNull: true,
  }
}, {
  timestamps: false,
  instanceMethods: {},
  freezeTableName: true,
  tableName: 'client'
});

ClientSchema.sync({});

module.exports = ClientSchema;
