const Models = require('../models/index');

module.exports = (router) => {

  router.get('/client', async (req, resp) => {
    const clients = await Models().Client.findAll();
    resp.json(clients);
  });

  router.post('/client', async (req, resp) => {
    let client = req.body;
    client = await Models().Client.create(client);
    resp.json(client);
  });

  router.get('/service-data', async (req, resp) => {
    const maritalStatuses = await Models().MaritalStatus.findAll();
    resp.json({
      maritalStatuses
    });
  });

};
