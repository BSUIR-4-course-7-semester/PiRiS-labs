const Models = require('../models/index');

module.exports = (router) => {

  router.get('/test', async (req, resp) => {
    resp.send('OK');
  });

  router.post('/test', async (req, resp) => {
    resp.send('OK');
  });

};
