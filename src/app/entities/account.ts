export class Account {
  id: number;
  number: number;
  account_code: string;
  activity: string;
  type: string;
  name: number;
  currency_type: number;
  balance: number;
  client_id: number;

  static createFromServerResponse(data): Account {
    const result = new Account();
    result.id = data.id;
    result.number = data.number;
    result.account_code = data.account_code;
    result.activity = data.activity;
    result.type = data.type;
    result.name = data.name;
    result.currency_type = data.currency_type;
    result.balance = data.balance;
    result.client_id = data.client_id;
    return result;
  }
}
