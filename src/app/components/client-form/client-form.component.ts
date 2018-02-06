import { Component } from '@angular/core';
import {Client} from '../../entities/client';
import {Form} from "@angular/forms";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {
  NAME_REG_EXP = /^А-Я[а-я]*$/;
  client = new Client();

  data: any;

  constructor(private dataService: DataService) {
    this.dataService.fetchServiceData()
    .then(data => {
      this.data = data;
    });
  }

  onSubmit() {
    return this.dataService.createClient(this.client)
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.error(err);
    });
  }

}
