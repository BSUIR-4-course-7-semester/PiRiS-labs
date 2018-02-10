const Models = require('../models/index');

const ERROR_MESSAGE = {
  'SequelizeUniqueConstraintError': 'Клиент с такими данными существует',
  'SequelizeValidationError': 'Некорректные данные',
};

function handleError(err) {
  const result = {};
  console.log(err.name);
  result.message = ERROR_MESSAGE[err.name];
  return result;
}

module.exports = (router) => {

  router.get('/client', async (req, resp) => {
    const clients = await Models().Client.findAll({ include: [{ all: true }] });
    resp.json(clients);
  });

  router.delete('/client/:id', async (req, resp) => {
    const deleted = await Models().Client.destroy({
      where: {
        id: req.params.id
      }
    });
    resp.json(deleted);
  });

  router.post('/client', async (req, resp) => {
    let client = req.body;
    try {
      client = await Models().Client.create(client);
      resp.json(client);
    } catch(err) {
      console.error(err);
      err = handleError(err);
      resp.status(400).send(err.message);
    }
  });

  router.put('/client', async (req, resp) => {
    let client = req.body;
    try {
      console.log(client)
      await Models().Client.update(client, {
        where: {
          id: client.id
        }
      });
      resp.json(client);
    } catch(err) {
      console.error(err);
      err = handleError(err);
      resp.status(400).send(err.message);
    }
  });

  router.get('/service-data', async (req, resp) => {
    const maritalStatuses = await Models().MaritalStatus.findAll();
    const cities = await Models().City.findAll();
    const nationalities = await Models().Nationality.findAll();
    const disabilities = await Models().Disability.findAll();
    resp.json({
      maritalStatuses,
      cities,
      nationalities,
      disabilities,
    });
  });

};
