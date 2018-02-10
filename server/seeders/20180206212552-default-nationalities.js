'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Nationalities', [
      {
        title: 'беларус',
      },
      {
        title: 'еврей',
      },
      {
        title: 'латыш',
      },
      {
        title: 'эстонец',
      },
      {
        title: 'русский',
      },
      {
        title: 'украинец',
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Nationalities', null, {});
  }
};
