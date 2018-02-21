import { Component } from '@angular/core';
import {Client} from "../../entities/client";
import {DataService} from "../../services/data.service";
import * as _ from 'lodash';

@Component({
  selector: 'client-manager',
  templateUrl: './client-manager.component.html',
  styleUrls: ['./client-manager.component.css']
})
export class ClientManagerComponent {
  private _client: Client;
  set client(val) {
    this._client = val ? Object.assign({}, val) : new Client();
  }
  get client() {
    return this._client;
  }
  clients = [];

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

  constructor(private dataService: DataService) {
    this.dataService.fetchClients()
    .then(data => {
      this.clients = _.sortBy(data, a => {
        return a.surname;
      });
    });
  }

  createNewClient() {
    this.client = null;
  }

  handleSelect(client) {
    this.client = client;
  }

  handleSubmit(clientData) {
    let method = clientData.id
      ? this.dataService.updateClient
      : this.dataService.createClient;

    method = method.bind(this.dataService);
    return method(clientData)
    .then(data => {
      if (clientData.id) {
        const client = this.clients.find(c => c.id === clientData.id);
        Object.keys(clientData).forEach(key => client[key] = clientData[key]);
      } else {
        this.clients.push(data);
      }
    })
    .catch(err => {
      this.message = err;
    });
  }

  handleDelete(client) {
    this.dataService.deleteClient(client.id)
    .then(() => {
      this.clients = this.clients.filter(c => c.id !== client.id);
      if (client.id) {
        this.client = new Client();
      }
    });
  }
}
