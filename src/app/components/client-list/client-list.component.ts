import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DataService} from "../../services/data.service";
import {Client} from "../../entities/client";

@Component({
  selector: 'client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent {
  @Input() clients = [];
  @Input() selected: Client;

  @Output() select = new EventEmitter();
  @Output() delete = new EventEmitter();

  selectClient(client) {
    this.select.emit(client);
  }

  deleteClient(client) {
    this.delete.emit(client);
  }
}
