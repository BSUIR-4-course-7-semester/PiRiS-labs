import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ClientFormComponent } from "./components/client-form/client-form.component";
import { ClientListComponent } from "./components/client-list/client-list.component";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {DataService} from "./services/data.service";


@NgModule({
  declarations: [
    AppComponent,
    ClientFormComponent,
    ClientListComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
  ],
  providers: [
    DataService,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
