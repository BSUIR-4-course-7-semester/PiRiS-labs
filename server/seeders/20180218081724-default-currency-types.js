'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CurrencyTypes', [
      {
        name: 'BYN',
      },{
        name: 'USD',
      },{
        name: 'EUR',
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CurrencyTypes', null, {});
  }
};
