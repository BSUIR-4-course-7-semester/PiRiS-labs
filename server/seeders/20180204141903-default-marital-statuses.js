'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('MaritalStatuses', [
      {
        title: 'married',
      },
      {
        title: 'single',
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('MaritalStatuses', null, {});
  }
};
