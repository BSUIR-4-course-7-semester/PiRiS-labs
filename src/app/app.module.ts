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
import {DepositFormComponent} from "./components/deposit-form/deposit-form.component";
import {CreditFormComponent} from "./components/credit-form/credit-form.component";
import {AccountListComponent} from "./components/account-list/account-list.component";
import {MinValueValidatorDirective, MaxValueValidatorDirective} from "./components/directives/min-value.directive";

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular4-fusioncharts';

FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);

const appRoutes: Routes = [
  {path: '*', redirectTo: '/', pathMatch: 'full'},
  {path: 'clients', component: ClientManagerComponent},
  {path: 'accounts', component: AccountListComponent},
  {path: 'create-credit', component: CreditFormComponent},
  {path: 'create-deposit', component: DepositFormComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    ClientFormComponent,
    ClientListComponent,
    ClientManagerComponent,
    DepositFormComponent,
    CreditFormComponent,
    AccountListComponent,
    MinValueValidatorDirective,
    MaxValueValidatorDirective,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FusionChartsModule,
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
