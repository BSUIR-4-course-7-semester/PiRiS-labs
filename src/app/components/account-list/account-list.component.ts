import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Client} from '../../entities/client';
import {DataService} from '../../services/data.service';
import {Deposit} from "../../entities/deposit";
import {formatDate, today} from "../../components/constants";
import moment = require("moment");

@Component({
  selector: 'deposit-form',
  templateUrl: './deposit-form.component.html',
  styleUrls: ['./deposit-form.component.css']
})
export class DepositFormComponent {

  accounts: Account[];

  constructor(private dataService: DataService) {
    this.dataService.fetchAccounts()
    .then(data => this.accounts = data);
  }

  finishDay() {
    return this.dataService.finishBankDay();
  }

}
