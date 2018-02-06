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
    .then(res => res.json());
  }

  fetchServiceData() {
    return this.http.get('/api/service-data')
    .toPromise()
    .then(res => res.json());
  }
}
