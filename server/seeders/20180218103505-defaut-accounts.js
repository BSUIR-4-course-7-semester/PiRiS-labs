'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CurrencyType', [
      {
        number: DataTypes.STRING,
        account_code: 7327,
        activity: 'passive',
        type: 'debit',
        name: 'Фонд развития банка',
        currency_type: 'BYN',
        balance: 100000000000,
      },
      {
        number: DataTypes.STRING,
        account_code: 7327,
        activity: 'passive',
        type: 'credit',
        name: 'Фонд развития банка',
        currency_type: 'BYN',
        balance: 0,
      },
      {
        number: DataTypes.STRING,
        account_code: 1010,
        activity: 'active',
        type: 'debit',
        name: 'Касса банка',
        currency_type: 'BYN',
        balance: 0,
      },
      {
        number: DataTypes.STRING,
        account_code: 1010,
        activity: 'active',
        type: 'credit',
        name: 'Касса банка',
        currency_type: 'BYN',
        balance: 0,
      },
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
