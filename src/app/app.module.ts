import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ClientFormComponent } from "./components/client-form/client-form.component";
import { ClientListComponent } from "./components/client-list/client-list.component";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {DataService} from "./services/data.service";
import {RouterModule, Routes} from "@angular/router";
import {ClientManagerComponent} from "./components/client-manager/client-manager.component";

const appRoutes: Routes = [
  {path: '*', redirectTo: '/', pathMatch: 'full'},
  {path: 'clients', component: ClientManagerComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    ClientFormComponent,
    ClientListComponent,
    ClientManagerComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    DataService,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
