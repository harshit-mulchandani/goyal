import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RoundPipe} from './pipes/round.pipe';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import {RouterModule, Router, Routes} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {HttpModule} from "@angular/http";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import { MaterializeModule } from "angular2-materialize";
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { SaleComponent } from './sale/sale.component';
import { DemandTransferComponent } from './demand-transfer/demand-transfer.component';
import { ViewComponent } from './view/view.component';
import { SettingsComponent } from './settings/settings.component';
import { InventoryComponent } from './inventory/inventory.component';
import {SaleService} from "./services/sale.service";
import {DataService} from "./services/data.service";
import { SaleslistComponent } from './saleslist/saleslist.component';
import {HotkeyModule} from 'angular2-hotkeys';
import {NgxPaginationModule} from 'ngx-pagination';
import {AuthGuardService} from "./services/auth-guard.service";
import {SearchPipe} from "./pipes/search.pipe";
import {DemandTransferService} from "./services/demand-transfer.service";


const routes:Routes =[
  {path: 'auth', component: AuthComponent},
  {path: '', component: AuthComponent},
  {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuardService]},
 {path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService]},
  {path: 'admin/sale', component: SaleComponent},
  {path: '**', redirectTo: 'auth'}


  ];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AdminPanelComponent,
    SaleComponent,
    DemandTransferComponent,
    ViewComponent,
    SettingsComponent,
    SearchPipe,
    InventoryComponent,
    RoundPipe,
    SaleslistComponent,

  ],

  imports: [
    BrowserModule,
    HotkeyModule.forRoot(),
    RouterModule.forRoot(routes),
    HttpModule,
    ReactiveFormsModule,
    MaterializeModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers: [AuthService,SaleService,DataService,DemandTransferService, { provide: 'Window',  useValue: window },AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
