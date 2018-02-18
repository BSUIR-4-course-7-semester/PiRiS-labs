'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Credits', [
      {
        title: 'КартаFUN',
        terms: '[12,24,36]',
        min_amount: 100.00,
        max_amount: 10000.00,
        currency: 'BYN',
        interest_rate: 16.30,
        type: 'differentiated'
      },
      {
        title: 'Пора действовать со Сбербанком',
        terms: '[12,24,36,48,60]',
        min_amount: 300.00,
        max_amount: 10000.00,
        currency: 'BYN',
        interest_rate: 15.80,
        type: 'annuity'
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Credits', null, {});
  }
};
