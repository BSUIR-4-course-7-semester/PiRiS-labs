const moment = require('moment');

const forceUpdate = require('../config/settings').database.forceUpdate;
const forceDatabaseUpdate = forceUpdate || !!process.env.FORCE_DB_UPDATE;

const NAME_REG_EXP = /^[А-Я][а-я]*$/;
const PASSPORT_NUMBER_REG_EXP = /^\d{7}$/;
const IDENTIFICATION_NUMBER_REG_EXP = /^\d{7}[A-Z]\d{3}[A-Z]{2}\d$/;
const EMAIL_REG_EXP = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const MOBILE_TEL_REG_EXP = /^\+375\d{9}$/;
const HOME_TEL_REG_EXP = /^80\d{9}$/;

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
      validate: {
        is: NAME_REG_EXP,
        len: [1, 200,]
      },
    },
    first_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        is: NAME_REG_EXP,
        len: [1, 200,]
      },
    },
    patronymic: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        is: NAME_REG_EXP,
        len: [1, 200,]
      },
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isBeforeNow: function(value) {
          if(moment(value).isAfter(moment())) {
            throw new Error('Only before now!')
          }
        }
      },
    },
    passport_series: {
      type: DataTypes.STRING(2),
      allowNull: false,
      set(val) {
        this.setDataValue('passport_series', val.toUpperCase());
      },
      validate: {
        notEmpty: true,
        len: [2, 2]
      }
    },
    passport_number: {
      type: DataTypes.STRING(7),
      allowNull: false,
      validate: {
        is: PASSPORT_NUMBER_REG_EXP,
        notEmpty: true,
        len: [7, 7]
      },
    },
    passport_reducer: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 300,]
      },
    },
    passport_reducing_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isBeforeNow: function(value) {
          if(moment(value).isAfter(moment())) {
            throw new Error('Only before now!')
          }
        }
      },
    },
    identification_number: {
      type: DataTypes.STRING(14),
      allowNull: false,
      validate: {
        is: IDENTIFICATION_NUMBER_REG_EXP,
        notEmpty: true,
        len: [14, 14]
      },
    },
    birth_place: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 300,]
      },
    },
    actual_residence_city_id: {
      type: DataTypes.INTEGER,  //  reference to city table
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    actual_address: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 300]
      },
    },
    home_tel_number: {
      type: DataTypes.STRING(11),
      allowNull: true,
      validate: {
        is: HOME_TEL_REG_EXP,
        len: [11, 11]
      },
    },
    mobile_tel_number: {
      type: DataTypes.STRING(13),
      allowNull: true,
      validate: {
        is: MOBILE_TEL_REG_EXP,
        len: [13, 13]
      },
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
      validate: {
        isEmail: true,
        len: [1, 200]
      },
    },
    job_place: {
      type: DataTypes.STRING(200),
      allowNull: true,
      validate: {
        len: [0, 200]
      },
    },
    job_position: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100]
      },
    },
    registration_city_id: {
      type: DataTypes.INTEGER,  //  reference to city table
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    registration_address: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 300]
      },
    },
    marital_status_id: {
      type: DataTypes.INTEGER,  //  reference to marital_status table
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    nationality_id: {
      type: DataTypes.INTEGER,  //  reference to nationality table
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    disability_id: {
      type: DataTypes.INTEGER,  //  reference to disability table
      allowNull: true,
    },
    pensioner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    monthly_revenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
      validate: {
        isFloat: true,
      },
    }
  }, {
    timestamps: false,
    indexes: [
      {
        unique: true, fields: [
          'surname',
          'first_name',
          'patronymic',
          'birth_date'
        ]
      },
      {
        unique: true, fields: [
          'passport_series',
          'passport_number',
        ]
      },
      {
        unique: true, fields: [
          'identification_number',
        ]
      },
    ]
  });

  Client.associate = function(models) {
    this.belongsTo(models['MaritalStatus'], {
      foreignKey: 'marital_status_id',
      as: 'marital_status'
    });
    this.belongsTo(models['City'], {
      foreignKey: 'registration_city_id',
      as: 'registration_city'
    });
    this.belongsTo(models['City'], {
      foreignKey: 'actual_residence_city_id',
      as: 'actual_residence_city'
    });
    this.belongsTo(models['Disability'], {
      foreignKey: 'disability_id',
      as: 'disability'
    });
    this.belongsTo(models['Nationality'], {
      foreignKey: 'nationality_id',
      as: 'nationality'
    });
  };

  return Client.sync({ force: forceDatabaseUpdate })
  .then(() => Client);
};
