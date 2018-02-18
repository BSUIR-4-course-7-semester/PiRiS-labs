import { Component } from '@angular/core';
import {Client} from "../../entities/client";
import {DataService} from "../../services/data.service";
import {CreditOrder} from "../../entities/credit-order";

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

  creditOrder = new CreditOrder();

  constructor(private dataService: DataService) {
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
    console.log(this.creditOrder);
  }
}
