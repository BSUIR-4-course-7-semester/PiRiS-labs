'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Disabilities', [
      {
        title: '1 группа',
      },
      {
        title: '2 группа',
      },
      {
        title: '3 группа',
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Disabilities', null, {});
  }
};
