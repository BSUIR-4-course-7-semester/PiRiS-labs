import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Client} from '../../entities/client';
import {DataService} from '../../services/data.service';
import {Deposit} from "../../entities/deposit";
import {formatDate, today} from "../../components/constants";
import moment = require("moment");

@Component({
  selector: 'account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent {

  accounts: Account[];

  constructor(private dataService: DataService) {
    this.loadAccounts();
  }

  loadAccounts() {
    this.dataService.fetchAccounts()
      .then(data => this.accounts = data);
  }

  finishDay() {
    return this.dataService.finishBankDay()
      .then(() => this.loadAccounts());
  }

}
