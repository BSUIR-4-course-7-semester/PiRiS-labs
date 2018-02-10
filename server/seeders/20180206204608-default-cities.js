'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Cities', [
      {
        title: 'Копыль'
      },
      {
        title: 'Минск'
      },
      {
        title: 'Калинковичи'
      },
      {
        title: 'Слуцк'
      },
      {
        title: 'Молодечно'
      },
      {
        title: 'Солигорск'
      },
      {
        title: 'Несвиж'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Cities', null, {});
  }
};
