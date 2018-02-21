import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Client} from '../entities/client';
import {Credit} from '../entities/credit';
import {Deposit} from "../entities/deposit";
import {CreditOrder} from "../entities/credit-order";

@Injectable()
export class DataService {
  constructor(private http: Http) {

  }

  createClient(client: Client) {
    return this.http.post('/api/client', client)
    .toPromise()
    .then(res => res.json())
    .catch(err => Promise.reject(err.text()));
  }

  updateClient(client: Client) {
    return this.http.put('/api/client', client)
    .toPromise()
    .then(res => res.json())
    .catch(err => Promise.reject(err.text()));
  }

  deleteClient(id: number) {
    return this.http.delete(`/api/client/${id}`)
    .toPromise()
    .then(res => res.json());
  }

  fetchServiceData() {
    return this.http.get('/api/service-data')
    .toPromise()
    .then(res => res.json());
  }

  fetchClients() {
    return this.http.get('/api/client')
    .toPromise()
    .then(res => res.json())
    .then(clients => clients.map(c => Client.createFromServerResponse(c)));
  }

  fetchCreditConditions() {
    return this.http.get('/api/credit-conditions')
    .toPromise()
    .then(res => res.json())
    .then(creditConditions => creditConditions.map(c => Credit.createFromServerResponse(c)));
  }

  fetchDepositConditions() {
    return this.http.get('/api/deposit-conditions')
      .toPromise()
      .then(res => res.json());
  }

  createDeposit(deposit: Deposit) {
    return this.http.post('api/deposit', deposit)
    .toPromise()
    .then(res => res.json());
  }

  createCredit(credit: CreditOrder) {
    return this.http.post('api/credit', credit)
      .toPromise()
      .then(res => res.json());
  }

  fetchAccounts() {
    return this.http.get('/api/accounts')
      .toPromise()
      .then(res => res.json());
  }

  finishBankDay() {
    return this.http.get('/api/finish')
      .toPromise()
      .then(res => res.json());
  }
}
