'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CurrencyType', [
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
    return queryInterface.bulkDelete('CurrencyType', null, {});
  }
};
