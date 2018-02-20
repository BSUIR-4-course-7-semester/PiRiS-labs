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

function createIndividualDepositAccounts(deposit) {
  const balance = deposit.balance;
  const clientId = deposit.client_id;
  return Promise.all([
    Models().Deposit.create(deposit),
    Models().Account.create(
      {
        number: `3014${Math.random * 10000000}1`,
        account_code: 3014,
        activity: 'passive',
        type: 'debit',
        name: 'Текущий счет клиента',
        currency_type: 'BYN',
        balance: 0,
        client_id: clientId
      }),
    Models().Account.create(
      {
        number: `3014${Math.random * 10000000}1`,
        account_code: 3014,
        activity: 'passive',
        type: 'credit',
        name: 'Текущий счет клиента',
        currency_type: 'BYN',
        balance: balance,
        client_id: clientId
      }),
      Models().Account.create(
       {
         number: `3014${Math.random * 10000000}1`,
         account_code: 3014,
         activity: 'passive',
         type: 'credit',
         name: ' Процентный счет клиента',
         currency_type: 'BYN',
         balance: 0,
         client_id: clientId
       }),
      Models().Account.create(
       {
         number: `3014${Math.random * 10000000}1`,
         account_code: 3014,
         activity: 'passive',
         type: 'debit',
         name: 'Процентный счет клиента',
         currency_type: 'BYN',
         balance: 0,
         client_id: clientId
       }),
  ]);
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

  router.put('/deposit', async (req, res) => {
    let deposit = req.body;
    try {
      const data = await createIndividualDepositAccounts(deposit);
      res.json(data);
    } catch(err) {
      console.error(err);
      err = handleError(err);
      res.status(400).send(err.message);
    }
  });

  router.get('/deposit-conditions', async (req, res) => {
    try {
      const deposit_types = await Models().DepositType.findAll();
      res.json({ deposit_types });
    } catch(err) {
      console.error(err);
      err = handleError(err);
      res.status(400).send(err.message);
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

  router.get('/credit-conditions', async (req, resp) => {
    const creditConditions = await Models().Credit.findAll({ include: [{ all: true }] });
    resp.json(creditConditions);
  });

};
