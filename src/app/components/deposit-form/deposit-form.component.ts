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
  NAME_REG_EXP = /^[А-Я][а-я]*$/;
  PASSPORT_NUMBER_REG_EXP = /^\d{7}$/;
  IDENTIFICATION_NUMBER_REG_EXP = /^\d{7}[A-Z]\d{3}[A-Z]{2}\d$/;
  EMAIL_REG_EXP = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  MOBILE_TEL_REG_EXP = /^\+375\d{9}$/;
  HOME_TEL_REG_EXP = /^80\d{9}$/;

  data: any;
  clients: Client[];
  deposit: Deposit;

  constructor(private dataService: DataService) {
    Promise.all([
      this.dataService.fetchDepositCondtions()
      .then(data => {
        debugger
        this.data = data
      }),
      this.dataService.fetchClients()
      .then(clients => {
        debugger
        this.clients = clients
      })
    ]);
  }

  onSubmit(event, form) {
    // if(!form.valid) return;
    // this.ready.emit(this.client);
  }

}
