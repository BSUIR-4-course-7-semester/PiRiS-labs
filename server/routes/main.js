const Models = require('../models/index');
const moment = require('moment');
const Promise = require('bluebird');

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

async function finishMonthForDeposits(bankAccounts) {
  const deposits = await Models().Deposit.findActiveDeposits();

  return Promise.all(deposits.map(async deposit => {
    const monthPercents = deposit.start_balance * deposit.interest_rate / 12 / 100;
    return Promise.all([
      deposit.incPassedMonth(),
      bankAccounts.cashDesk.debit.plus(monthPercents),
      bankAccounts.bank.debit.plus(monthPercents),
      deposit.account_percent_credit.plus(monthPercents),
      deposit.account_percent_debit.plus(monthPercents)
    ])
      .then(_ => {
        console.log(deposit.month_passed)
        console.log(deposit.term_in_month)
        if(deposit.month_passed === deposit.term_in_month) {
          console.log('test')
          return Promise.all([
            deposit.account_current_debit.plus(deposit.start_balance),
            deposit.account_current_credit.plus(deposit.start_balance),
            bankAccounts.bank.debit.plus(deposit.start_balance),
            bankAccounts.cashDesk.debit.plus(deposit.start_balance),
          ]);
        }

        return _;
      });
  }));
}

async function finishMonth() {
  const today = moment();
  const bankAccounts = await Models().Account.findBankAccounts();

  return Promise.all([
    finishMonthForDeposits(bankAccounts),
    // payCredit(today, accounts.bank, accounts.cashDesk)
  ]);
}

async function sendMoneyToBank(bank, deposit) {
  if (deposit.account_current_credit.balance > deposit.account_current_debit.balance) {

    bank.credit.balance = bank.credit.balance +
      deposit.account_current_credit.balance - deposit.account_current_debit.balance;
    deposit.account_current_debit.balance = deposit.account_current_credit.balance;

    return Promise.all([
      bank.credit.update(),
      deposit.account_current_debit.update()
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
     bank.debit.balance -= percent;

     return Promise.all([
       deposit.account_percent_credit.update(),
       bank.debit.update(),
     ]);
   }

  } else if (deposit.deposit_type.type === 'time') {
    if (isReadyForFullPercent(today, deposit)) {
      const percent = getDepositPercent(deposit, deposit.term);
      deposit.account_percent_credit.balance += percent;

      return Promise.all([
        deposit.account_percent_credit.update(),
        bank.debit.update(),
      ]);
    }
  }

  return Promise.resolve();
}

async function payBackDepositPercentToCash(cash, deposit) {
  if (deposit.account_percent_credit.balance > deposit.account_percent_debit.balance) {
    cash.debit.balance = deposit.account_percent_credit.balance - deposit.account_percent_debit.balance;
    deposit.account_percent_debit.balance = deposit.account_percent_credit.balance;

    return Promise.all([
                         deposit.account_percent_debit.update(),
                         cash.debit.update(),
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
  if (cash.credit.balance > cash.debit.balance) {
    cash.debit.balance = cash.credit.balance;
    return cash.debit.update();

  } else {
    cash.credit.balance = cash.debit.balance;
    return cash.credit.update();
  }
}

async function moveCreditToCash(cash, credit) {
  cash.debit += credit.account_current_debit.balance;
  credit.account_current_credit.balance -= credit.account_current_debit.balance;

  return Promise.all([
    credit.debit.update(),
    credit.account_current_credit.update(),
  ]);
}

async function payCreditPercentToBank(today, bank, cash, credit) {
  if (credit.credit.type === 'annuity') {
    if (isReadyForMonthPercent(today, credit)) {
      const percent = credit.account_current_credit.balance * credit.interest_rate / 12;
      bank.credit.balance += percent;
      cash.debit.balance += percent;
      cash.credit.balance += percent;
      credit.account_current_debit.balance += percent;
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

// TODO(nastya) => need to fix
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
      credit.account_current_debit_id  = res[0].id;
      credit.account_current_credit_id = res[1].id;
      credit.account_percent_credit_id = res[2].id;
      credit.account_percent_debit_id  = res[3].id;
      console.log(credit);
      return Models().Credit.create(credit)
    });
}

function createIndividualDepositAccounts(deposit) {
  const balance = deposit.start_balance;
  const clientId = deposit.client_id;
  const random = () => Math.round(Math.random() * 10000000);
  return Promise.all([
    Models().Account.create({
      number: `3014${random()}1`,
      account_code: 3014,
      activity: 'passive',
      type: 'debit',
      name: 'Текущий счет клиента',
      currency_type: 'BYN',
      balance: balance,
      client_id: clientId
    }),
    Models().Account.create({
      number: `3014${random()}1`,
      account_code: 3014,
      activity: 'passive',
      type: 'credit',
      name: 'Текущий счет клиента',
      currency_type: 'BYN',
      balance: balance,
      client_id: clientId
    }),
    Models().Account.create({
      number: `3014${random()}1`,
      account_code: 3014,
      activity: 'passive',
      type: 'credit',
      name: ' Процентный счет клиента',
      currency_type: 'BYN',
      balance: 0,
      client_id: clientId
    }),
    Models().Account.create({
      number: `3014${random()}1`,
      account_code: 3014,
      activity: 'passive',
      type: 'debit',
      name: 'Процентный счет клиента',
      currency_type: 'BYN',
      balance: 0,
      client_id: clientId
    }),
    Models().Account.findBankAccounts()
      .then(bankAccounts => {
        return Promise.all([
          bankAccounts.bank.credit.plus(balance),
          bankAccounts.cashDesk.credit.plus(balance),
          bankAccounts.cashDesk.debit.plus(balance),
        ]);
      })
  ])
  .spread((debit, credit, percentCredit, percentDebit, ...bankOperations) => {
    deposit.account_current_debit_id  = debit.id;
    deposit.account_current_credit_id = credit.id;
    deposit.account_percent_credit_id = percentCredit.id;
    deposit.account_percent_debit_id  = percentDebit.id;
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
      const data = await finishMonth();
      res.json(data);
    } catch (err) {
      console.error(err);
      err = handleError(err);
      res.status(400).send(err.message);
    }
  });

};
