'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CurrencyType', [
      { // belveb
        type: 'time',
        name: 'Выдатны',
        term_in_month: '12',
        interest_rate: 10.5,
        payment: 'capitalization',
        early_repayment: false,
        currency_type: 'BYN',
        min_contribution: 100,
      },
      {
        type: 'call',
        name: 'Универсальный',
        term_in_month: '6',
        interest_rate: 7.9,
        payment: 'monthly',
        early_repayment: true,
        currency_type: 'BYN',
        min_contribution: 100,
      },
      { // sberbank
        type: 'time',
        name: 'Сохраняй',
        term_in_month: '3',
        interest_rate: 9.1,
        payment: 'monthly',
        early_repayment: false,
        currency_type: 'BYN',
        min_contribution: 50,
      },
      {
        type: 'call',
        name: 'Приумножай',
        term_in_month: '1',
        interest_rate: 7,
        payment: 'monthly',
        early_repayment: false,
        currency_type: 'BYN',
        min_contribution: 100,
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('DepositType', null, {});
  }
};
