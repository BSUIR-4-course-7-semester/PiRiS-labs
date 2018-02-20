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
import {CreditFormComponent} from "./components/credit-form/credit-form.component";
import {MinValueValidatorDirective, MaxValueValidatorDirective} from "./components/directives/min-value.directive";

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular4-fusioncharts';

FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);

const appRoutes: Routes = [
  {path: '*', redirectTo: '/', pathMatch: 'full'},
  {path: 'clients', component: ClientManagerComponent},
  {path: 'create-credit', component: CreditFormComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    ClientFormComponent,
    ClientListComponent,
    ClientManagerComponent,
    CreditFormComponent,
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
