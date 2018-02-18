export class CreditOrder {
  id: number;
  client_id: number;

  static createFromServerResponse(data): CreditOrder {
    const result = new CreditOrder();
    result.id = data.id;
    result.client_id = data.client_id;
    return result;
  }
}
