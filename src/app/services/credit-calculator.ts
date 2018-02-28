
import {CreditOrder} from "../entities/credit-order";

export class CreditCalculator {
  static CALCULATOR_WAY = {
    'annuity': CreditCalculator.annuityPays,
    'differentiated': CreditCalculator.differentiatedPays,
  };

  static pays(creditOrder: CreditOrder) {
    return CreditCalculator.CALCULATOR_WAY[creditOrder.type](creditOrder);
  }

  static annuityPays(creditOrder: CreditOrder) {
    const interestRateForMonth = creditOrder.interest_rate / creditOrder.term / 100;
    const annuityCoefficient =
      (interestRateForMonth * Math.pow(1 + interestRateForMonth, creditOrder.term))
      /
      (Math.pow(1 + interestRateForMonth, creditOrder.term) - 1);
    const payForMonth = Math.round(creditOrder.amount * annuityCoefficient * 100) / 100;

    const result = [];

    for(let i = 0; i < creditOrder.term; i++) {
      result.push(payForMonth);
    }

    return result;
  }

  static differentiatedPays(creditOrder: CreditOrder) {
    // b = S / N
    // b – основной платёж, S – размер кредита, N – количество месяцев.
    //
    // p = Sn * P / 12, где
    // p – начисленные проценты, Sn — остаток задолженности на период, P – годовая процентная ставка по кредитy.
    //
    // Sn = S — (b * n), где
    // n – количество прошедших периодов.

    function remainToPay(month, amount, baseMonthPay) {
      return amount - month * baseMonthPay;
    }

    const baseMonthPay = creditOrder.amount / creditOrder.term;

    let payed = 0;
    const result = [];

    for(let month = 0; month < creditOrder.term; month++) {
      const percents = remainToPay(month, creditOrder.amount, baseMonthPay) * creditOrder.interest_rate / creditOrder.term / 100;
      const pay = Math.round((baseMonthPay + percents) * 100) / 100;
      result.push(pay);
    }

    return result;
  }
}
