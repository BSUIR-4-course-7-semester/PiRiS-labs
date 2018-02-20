import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Client} from '../../entities/client';
import {DataService} from '../../services/data.service';
import {Deposit} from "../../entities/deposit";

@Component({
  selector: 'deposit-form',
  templateUrl: './deposit-form.component.html',
  styleUrls: ['./deposit-form.component.css']
})
export class DepositFormComponent {
  NATURAL_NUMBERS_EXP = /^[0-9]{1,7}$/;

  data: any;
  clients: Client[];
  deposit: Deposit;
  selected_deposit_type: any;

  constructor(private dataService: DataService) {
    this.deposit = new Deposit();

    Promise.all([
      this.dataService.fetchDepositConditions()
      .then(data => this.data = data),
      this.dataService.fetchClients()
      .then(clients => this.clients = clients)
    ]);
  }

  depositTypeSelectHandle(deposit_type_id) {
    this.selected_deposit_type = this.data.deposit_types
      .find(type => type.id === parseInt(deposit_type_id, 10));

    this.deposit.interest_rate = this.selected_deposit_type.interest_rate;
    this.deposit.term_in_month = this.selected_deposit_type.term_in_month;
    this.deposit.currency_type = this.selected_deposit_type.currency_type;
  }

  onSubmit(event, form) {
    if(!form.valid) return;
    return this.dataService.createDeposit(this.deposit);
  }

}
