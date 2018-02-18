export class CreditOrder {
  id: number;
  client_id: number;
  term: number;
  credit_id: number;

  static createFromServerResponse(data): CreditOrder {
    const result = new CreditOrder();
    result.id = data.id;
    result.client_id = data.client_id;
    result.term = data.term;
    result.credit_id = data.credit_id;
    return result;
  }
}
