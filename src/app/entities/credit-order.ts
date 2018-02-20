import {formatDate, today} from "../components/constants";

export class CreditOrder {
  id: number;
  client_id: number;
  term: number;
  credit_id: number;
  currency: string;
  type: string;
  begin_date = formatDate(today());
  end_date = formatDate(today());
  amount = 100.00;
  interest_rate = 10.00;

  static createFromServerResponse(data): CreditOrder {
    const result = new CreditOrder();
    result.id = data.id;
    result.client_id = data.client_id;
    result.term = data.term;
    result.credit_id = data.credit_id;
    result.currency = data.currency;
    result.amount = data.amount;
    result.interest_rate = data.interest_rate;
    result.begin_date = formatDate(data.begin_date);
    result.end_date = formatDate(data.end_date);
    return result;
  }
}
