export class Deposit {
  id: number;
  deposit_type_id: number;
  number: number;
  currency_type_id: number;
  start_date: Date;
  end_date: Date;
  term_in_month: number;
  start_balance: number;
  interest_rate: number;
  client_id: number;

  static createFromServerResponse(data): Deposit {
    const result = new Deposit();
    result.id = data.id;
    result.deposit_type_id = data.deposit_type_id;
    result.number = data.number;
    result.currency_type_id = data.currency_type_id;
    result.start_date = data.start_date;
    result.end_date = data.end_date;
    result.term_in_month = data.term_in_month;
    result.start_balance = data.start_balance;
    result.interest_rate = data.interest_rate;
    result.client_id = data.client_id;
    return result;
  }
}
