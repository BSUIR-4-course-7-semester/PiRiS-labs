import { Component } from '@angular/core';
import {DataService} from "../../services/data.service";
import {CreditOrder} from "../../entities/credit-order";
import {formatDate} from "../constants";
import moment = require("moment");
import {CreditCalculator} from "../../services/credit-calculator";

@Component({
  selector: 'credit-form',
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.css']
})
export class CreditFormComponent {
  clients = [];
  creditConditions = [];

  _message = null;
  set message(val) {
    this._message = val;
    setTimeout(() => {
      this._message = null;
    }, 5000);
  }
  get message() {
    return this._message;
  }

  get creditCondition() {
    return this.creditConditions.find(c => c.id == this.creditOrder.credit_id);
  }

  chartDataSource = {
    chart: {
      caption: 'График платежей по кредиту',
      numberprefix: 'BYN',
      theme: 'fint'
    },
    data: []
  };

  get chartInfo() {
    return {
      id: 'credit_chart',
      type: 'column2d',
      dataFormat: 'json',
      dataSource: this.chartDataSource
    };
  }

  creditOrder: CreditOrder;

  constructor(private dataService: DataService) {
    this.clearCreditOrder();
    this.dataService.fetchClients()
    .then(data => {
      this.clients = data;
    });
    this.dataService.fetchCreditConditions()
    .then(data => {
      this.creditConditions = data;
    });

  }

  clearCreditOrder() {
    this.creditOrder = new CreditOrder();
  }

  handleSubmit() {
    this.dataService.createCredit(this.creditOrder);
  }

  handleCreditTermChange(ev) {
    this.creditOrder.end_date = formatDate(moment(this.creditOrder.begin_date)
      .add(this.creditOrder.term, 'month'));
    this.prepareChartData();
  }

  handleCreditConditionChange() {
    this.creditOrder.type = this.creditCondition.type;
    this.prepareChartData();
  }

  prepareChartData() {
    this.chartDataSource.chart.numberprefix = this.creditOrder.currency;

    const dateStart = moment(this.creditOrder.begin_date);
    const dateEnd = moment(this.creditOrder.end_date);
    const timeValues = [];

    while (dateStart.isBefore(dateEnd)) {
      timeValues.push(formatDate(dateStart));
      dateStart.add(1,'month');
    }

    const pays = CreditCalculator.pays(this.creditOrder);

    this.chartDataSource.data = timeValues.map((month, idx) => {
      return {
        label: month,
        value: pays[idx]
      };
    });
  }
}
