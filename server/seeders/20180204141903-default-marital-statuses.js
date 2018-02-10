'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('MaritalStatuses', [
      {
        title: 'замужем / женат',
      },
      {
        title: 'холост / не замужем',
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('MaritalStatuses', null, {});
  }
};
