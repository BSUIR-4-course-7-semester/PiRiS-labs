import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Client} from '../../entities/client';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {
  NAME_REG_EXP = /^[А-Я][а-я]*$/;
  PASSPORT_NUMBER_REG_EXP = /^\d{7}$/;
  IDENTIFICATION_NUMBER_REG_EXP = /^\d{7}[A-Z]\d{3}[A-Z]{2}\d$/;
  EMAIL_REG_EXP = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  MOBILE_TEL_REG_EXP = /^\+375\d{9}$/;
  HOME_TEL_REG_EXP = /^80\d{9}$/;

  @Input() client = new Client();
  @Output() ready = new EventEmitter();

  data: any;

  constructor(private dataService: DataService) {
    this.dataService.fetchServiceData()
    .then(data => {
      this.data = data;
    });
  }

  onSubmit(event, form) {
    event.preventDefault();
    if(!form.valid) return;
    this.ready.emit(this.client);
  }

}
