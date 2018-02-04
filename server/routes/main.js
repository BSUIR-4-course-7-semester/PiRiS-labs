const Test = require('../models/test');


module.exports = (router) => {

  router.get('/test', async (req, resp) => {
    resp.json({
      message: 'OK'
    });
  });

  router.post('/test', async (req, resp) => {
    const title = req.body.title;

    try {
      const test = await Test.createTest(title);
      resp.json(test);
    } catch(err) {
      resp.status(400).json({
        message: err.message
      });
    }
    
  });

};
