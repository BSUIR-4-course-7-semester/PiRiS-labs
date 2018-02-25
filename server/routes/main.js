const Models = require('../models/index');
const moment = require('moment');

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

async function finishDay() {
  const today = moment();
  const accounts = Accounts.findAll({ where: { client_id: null }});
  const bank = {
    credit: accounts.filter(account => account.type === 'credit' && account.code === 7327),
    debet: accounts.filter(account => account.type === 'debet' && account.code === 7327),
  };
  const cash = {
    credit: accounts.filter(account => account.type === 'credit' && account.code === 1010),
    debet: accounts.filter(account => account.type === 'debet' && account.code === 1010),
  };

  const deposits = payDeposit(today, bank, cash);
  const credits = payCredit(today, bank, cash);
}

async function sendMoneyToBank(bank, deposit) {
  if (deposit.account_current_credit.balance > deposit.account_current_debet.balance) {

    bank.credit.balance = bank.credit.balance +
      deposit.account_current_credit.balance - deposit.account_current_debet.balance;
    deposit.account_current_debet.balance = deposit.account_current_credit.balance;

    return Promise.all([
      bank.credit.update(),
      deposit.account_current_debet.update()
    ]);
  } else {
    return Promise.resolve();
  }
}

function getDateDiffObject(today, document) {
  return {
    todayDays: moment(today).day(),
    startDays: moment(document.start_date || document.begin_date).day(),
    todayMonth: moment(today).month(),
    startMonth: moment(document.start_date || document.begin_date).month(),
  }
}

function isReadyForMonthPercent(today, document) {
  const d = getDateDiffObject(today, document);

  console.log('MONTH PERCENT(tM, sM, tD, sD):', d.todayMonth, d.startMonth, d.todayDays, d.startDays);
  return d.todayMonth !== d.startMonth && d.todayDays === d.startDays;
}

function isReadyForFullPercent(today, document) {
  const d = getDateDiffObject(today, document);
  const monthDiff = d.todayMonth - d.startMonth;

  console.log('FULL PERCENT(tM, sM, tD, sD):', d.todayMonth, d.startMonth, d.todayDays, d.startDays);
  return monthDiff === document.term && d.todayDays === d.startDays;
}


function getDepositPercent(deposit, month) {
  return deposit.account_current_credit.balance * deposit.interest_rate / 12 * month;
}

async function sendPercent(today, bank, deposit) {
  if (deposit.deposit_type.type === 'call') {
   if (isReadyForMonthPercent(today, deposit)) {
     const percent = getDepositPercent(deposit, 1);
     deposit.account_percent_credit.balance += percent;
     bank.debet.balance -= percent;

     return Promise.all([
       deposit.account_percent_credit.update(),
       bank.debet.update(),
     ]);
   }

  } else if (deposit.deposit_type.type === 'time') {
    if (isReadyForFullPercent(today, deposit)) {
      const percent = getDepositPercent(deposit, deposit.term);
      deposit.account_percent_credit.balance += percent;

      return Promise.all([
        deposit.account_percent_credit.update(),
        bank.debet.update(),
      ]);
    }
  }

  return Promise.resolve();
}

async function payBackDepositPercentToCash(cash, deposit) {
  if (deposit.account_percent_credit.balance > deposit.account_percent_debet.balance) {
    cash.debet.balance = deposit.account_percent_credit.balance - deposit.account_percent_debet.balance;
    deposit.account_percent_debet.balance = deposit.account_percent_credit.balance;

    return Promise.all([
                         deposit.account_percent_debet.update(),
                         cash.debet.update(),
                       ]);
  }
  return Promise.resolve();
}

async function payBackDeposit(today, cash, deposit) {
  if (deposit.deposit_type.type === 'call') {
    if (isReadyForMonthPercent(today, deposit)) {
      return payBackDepositPercentToCash(cash, deposit);
    }

  } else if (deposit.deposit_type.type === 'time') {
    if (isReadyForFullPercent(today, deposit)) {
      return payBackDepositPercentToCash(cash, deposit);
    }
  }

  return Promise.resolve();
}

function clearCash(cash) {
  if (cash.credit.balance > cash.debet.balance) {
    cash.debet.balance = cash.credit.balance;
    return cash.debet.update();

  } else {
    cash.credit.balance = cash.debet.balance;
    return cash.credit.update();
  }
}

// TODO => close accounts
async function payDeposit(today, bank, cash) {
  const deposits = Models().Deposit.findAll({ include: [{ all: true }] });

  return Promise.all(
    deposits.map(deposit => {
      return clearCash()
      .then(() => sendMoneyToBank(bank, deposit))
      .then(() => sendPercent(today, bank, deposit))
      .then(() => payBackDeposit(today, cash, deposit));
    })
  );
}

// TODO => remove babos iz banka pered vidachey
async function moveCreditToCash(cash, credit) {
  cash.debet += credit.account_current_debet.balance;
  credit.account_current_credit.balance -= credit.account_current_debet.balance;

  return Promise.all([
    credit.debet.update(),
    credit.account_current_credit.update(),
  ]);
}

async function payCreditPercentToBank(today, bank, cash, credit) {
  if (credit.credit.type === 'annuity') {
    if (isReadyForMonthPercent(today, credit)) {
      const percent = credit.account_current_credit.balance * credit.interest_rate / 12;
      bank.credit.balance += percent;
      cash.debet.balance += percent;
      cash.credit.balance += percent;
      credit.account_current_debet.balance += percent;
    }
  }
}

async function payCredit(today, bank) {
  const credits = Models().Credit.findAll({ include: [{ all: true }] });

  return Promise.all(
    credits.map(credit => {
      return moveCreditToCash(cash, credit)
      .then(() => clearCash(cash))
      .then(() => sendPercent(today, bank, deposit))
      .then(() => payBackDeposit(today, cash, deposit));
    })
  );
}

function createIndividualCreditAccounts(credit) {
  const balance = credit.amount;
  const clientId = credit.client_id;
  const random = () => Math.round(Math.random() * 10000000);

  return Promise.all([
    Models().Account.create(
     {
       number: `2400${random()}1`,
       account_code: 2400,
       activity: 'active',
       type: 'debit',
       name: 'Текущий счет клиента',
       currency_type: 'BYN',
       balance: balance,
       client_id: clientId
     }),
    Models().Account.create(
     {
       number: `2400${random()}1`,
       account_code: 2400,
       activity: 'active',
       type: 'credit',
       name: 'Текущий счет клиента',
       currency_type: 'BYN',
       balance: 0,
       client_id: clientId
     }),
    Models().Account.create(
     {
       number: `2400${random()}1`,
       account_code: 2400,
       activity: 'active',
       type: 'credit',
       name: ' Процентный счет клиента',
       currency_type: 'BYN',
       balance: 0,
       client_id: clientId
     }),
    Models().Account.create(
     {
       number: `2400${random()}1`,
       account_code: 2400,
       activity: 'active',
       type: 'debit',
       name: 'Процентный счет клиента',
       currency_type: 'BYN',
       balance: 0,
       client_id: clientId
     }),
  ])
    .then((res) => {
      credit.account_current_debet_id  = res[0].id;
      credit.account_current_credit_id = res[1].id;
      credit.account_percent_credit_id = res[2].id;
      credit.account_percent_debet_id  = res[3].id;
      console.log(credit);
      return Models().Credit.create(credit)
    });
}

function createIndividualDepositAccounts(deposit) {
  const balance = deposit.start_balance;
  const clientId = deposit.client_id;
  const random = () => Math.round(Math.random() * 10000000);
  return Promise.all([
    Models().Account.create(
      {
        number: `3014${random()}1`,
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
        number: `3014${random()}1`,
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
         number: `3014${random()}1`,
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
         number: `3014${random()}1`,
         account_code: 3014,
         activity: 'passive',
         type: 'debit',
         name: 'Процентный счет клиента',
         currency_type: 'BYN',
         balance: 0,
         client_id: clientId
       }),
  ]).then((res) => {
    deposit.account_current_debet_id  = res[0].id;
    deposit.account_current_credit_id = res[1].id;
    deposit.account_percent_credit_id = res[2].id;
    deposit.account_percent_debet_id  = res[3].id;
    console.log(deposit);
    return Models().Deposit.create(deposit);

  });
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

  router.post('/deposit', async (req, res) => {
    let deposit = req.body;
    try {
      const data = createIndividualDepositAccounts(deposit);
      res.json(deposit);
    } catch(err) {
      console.error(err);
      err = handleError(err);
      res.status(400).send(err.message);
    }
  });

  router.post('/credit', async (req, res) => {
    let credit = req.body;
    try {
      const data = createIndividualCreditAccounts(credit);
      res.json(credit);
    } catch(err) {
      console.error(err);
      err = handleError(err);
      res.status(400).send(err.message);
    }
  });

  router.get('/accounts', async (req, res) => {
    const accounts = await Models().Account.findAll({ include: [{ all: true }] });
    res.json(accounts);
  });

  router.get('/finish', async (req, res) => {
    try {
      const data = await finishDay();
      res.json(data);
    } catch (err) {
      console.error(err);
      err = handleError(err);
      res.status(400).send(err.message);
    }
  });

};
