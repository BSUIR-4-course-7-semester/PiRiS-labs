'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Accounts', [
      {
        number: '7327000000001',
        account_code: 7327,
        activity: 'passive',
        type: 'debit',
        name: 'Фонд развития банка',
        currency_type: 'BYN',
        balance: 0,
      },
      {
        number: '7327000000011',
        account_code: 7327,
        activity: 'passive',
        type: 'credit',
        name: 'Фонд развития банка',
        currency_type: 'BYN',
        balance: 10000000,
      },
      {
        number: '1010000000001',
        account_code: 1010,
        activity: 'active',
        type: 'debit',
        name: 'Касса банка',
        currency_type: 'BYN',
        balance: 0,
      },
      {
        number: '1010000000011',
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
    return queryInterface.bulkDelete('Accounts', null, {});
  }
};
