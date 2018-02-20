module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Clients', [{
      surname: 'Боровский',
      first_name: 'Максим',
      patronymic: 'Анатольевич',
      birth_date: new Date(1997, 4, 17),
      passport_series: 'МС',
      passport_number: '2524545',
      passport_reducer: 'РОВД',
      passport_reducing_date: new Date(2013, 05, 13),
      identification_number: '7777777A333AA1',
      birth_place: 'Копыль',
      actual_residence_city_id: 1,
      actual_address: 'Дзержинского 95',
      home_tel_number: '80171954137',
      mobile_tel_number: '+375297053532',
      email: 'max@senior-node.com',
      job_place: 'senior node',
      job_position: 'developer',
      registration_address: 'Минск',
      marital_status_id: 2,
      nationality_id: 1,
      disability_id: null,
      pensioner: false,
      monthly_revenue: 1000.00,
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Clients', null, {});
  }
};
