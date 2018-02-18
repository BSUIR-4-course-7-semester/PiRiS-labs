export class Credit {
  id: number;
  title: string;
  terms: [number];
  min_amount: number;
  max_amount: number;
  currency: string;
  interest_rate: number;
  type: string;

  static createFromServerResponse(data): Credit {
    const result = new Credit();
    result.id = data.id;
    result.title = data.title;
    result.terms = data.terms;
    result.min_amount = data.min_amount;
    result.max_amount = data.max_amount;
    result.currency = data.currency;
    result.interest_rate = data.interest_rate;
    result.type = data.type;
    return result;
  }
}
