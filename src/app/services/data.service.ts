import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Client} from '../entities/client';

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
}
