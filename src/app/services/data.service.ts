import {EventEmitter, Injectable, Output, OnInit} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {ObserveOnMessage} from "rxjs/operator/observeOn";
import { Subject} from "rxjs/Subject";
import {Observable} from 'rxjs';
@Injectable()
export class DataService implements OnInit{
  warehouseNameEvent: EventEmitter<any> = new EventEmitter();
  preloaderShow = new Subject<boolean>();
  preloaderShow$ = this.preloaderShow.asObservable();
  loggedInWarehouse = new Subject<any>();
  loggedInWarehouse$ = this.loggedInWarehouse.asObservable();
  whmanagerData: any;
  marketingPersonData: any;
  officePersonData: any;
  customerData: any;
  items: any[] = [];
  itemsSubject = new Subject<any>();
  itemsSubject$ = this.itemsSubject.asObservable();



  officePerson = new Subject<any>();
  officePerson$ = this.officePerson.asObservable();

  marketingPerson = new Subject<any>();
  marketingPerson$ = this.marketingPerson.asObservable();

  warehouseManager = new Subject<any>();
  warehouseManager$ = this.warehouseManager.asObservable();



  constructor(private http: Http) {
    this.http.get('http://goyal.azurewebsites.net/api/get_warehouse.php').subscribe(
      (data) => {
        this.warehouseNameEvent.emit(data.json());
      }
    );

  }
  ngOnInit(){



    }

  // sendmail(email, body) {
  //   console.log('mil gya h');
  //   const mailbody = {'email': email, 'body': body};
  //   const final = JSON.stringify(mailbody);
  //   const headers = new Headers();
  //   // headers.append('Content-Type' , 'application/json');
  //   return this.http.post('http://localhost/api/mail.php' , final, {headers: headers});
  // }
  addItem(toAdd:any):Observable<any>{
    const body = JSON.stringify(toAdd);
    console.log(body);
    const headers = new Headers();
    return this.http.post("http://goyal.azurewebsites.net/api/item_add_quantity.php", body, {headers: headers});
  }

  getCurrentWarehouse()
  {
    var temp = localStorage.getItem('auth_user_warehouse');
    this.loggedInWarehouse.next(temp);
  }

  getWarehouse() {
    return this.http.get('http://goyal.azurewebsites.net/api/get_warehouse.php');
  }

  getWhmanager() {
    // this.preloaderShow.next(true);
    this.http.get('http://goyal.azurewebsites.net/api/get_whmanager.php').subscribe((data)=>{
      var temp = data;
      console.log(temp,"whdata");
      this.warehouseManager.next(temp);
    });
  }
  getMarketingPerson() {
    // this.preloaderShow.next(true);
    this.http.get('http://goyal.azurewebsites.net/api/get_marketingperson.php').subscribe((data)=>{
      var temp2 = data;
      console.log(temp2,"mktngpersondata");
      this.marketingPerson.next(temp2);
    });
  }
  getOfficePerson() {
    // this.preloaderShow.next(true);
    this.http.get('http://goyal.azurewebsites.net/api/get_officeperson.php').subscribe((data)=>{
      var temp3 = data;
      console.log(temp3,"officepersondata");
      this.officePerson.next(temp3);
    });
  }
  getCustomer() {
    return this.http.get('http://goyal.azurewebsites.net/api/get_customer.php');
  }
  getProduct() {
    return this.http.get('http://goyal.azurewebsites.net/api/get_items.php');
  }

  getItemQuantity() {
    return this.http.get('http://goyal.azurewebsites.net/api/get_item_quantity.php');
  }
  createWhmanager(whmanagerData: any) {
    const body = JSON.stringify(whmanagerData);
    console.log(body);
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    return this.http.post('http://goyal.azurewebsites.net/api/add_whmanager.php' , body, {headers: headers});
  }
  createUser(userData: any, role) {
    if (role == 'marketingperson') {
      const body = JSON.stringify(userData);
      console.log(body);
      const headers = new Headers();
      // headers.append('Content-Type' , 'application/json');
      return this.http.post('http://goyal.azurewebsites.net/api/add_user.php', body, {headers: headers});
    }
    else if (role == 'officeperson') {
      const body = JSON.stringify(userData);
      console.log(body);
      const headers = new Headers();
      // headers.append('Content-Type' , 'application/json');
      return this.http.post('http://goyal.azurewebsites.net/api/add_user.php', body, {headers: headers});
    }
    else {
      const body = JSON.stringify(userData);
      console.log(body);
      const headers = new Headers();
      // headers.append('Content-Type' , 'application/json');
      return this.http.post('http://goyal.azurewebsites.net/api/add_user.php', body, {headers: headers});
    }
  }
  createWh(whData: any) {
    const body = JSON.stringify(whData);
    console.log(body);
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    return this.http.post('http://goyal.azurewebsites.net/api/add_warehouse.php' , body, {headers: headers});
  }
  createItem(itemData: any) {
    const body = JSON.stringify(itemData);
    console.log(body);
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    return this.http.post('http://goyal.azurewebsites.net/api/add_item.php' , body, {headers: headers});
  }
  createDemandOrder(demandOrderData: any) {
    const body = JSON.stringify(demandOrderData);
    console.log(body);
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    return this.http.post('http://goyal.azurewebsites.net/api/add_demand_order.php' , body, {headers: headers});
  }
  getDemandOrder(warehouse) {
    const body = JSON.stringify(warehouse);
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    return this.http.post('http://goyal.azurewebsites.net/api/get_demand_order.php' , body, {headers: headers});
  }
  getTransferOrder(warehouse) {
    const body = JSON.stringify(warehouse);
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    return this.http.post('http://goyal.azurewebsites.net/api/get_transfer_order.php' , body, {headers: headers});
  }
  getInvoiceList(invoiceData) {
    const body = JSON.stringify(invoiceData);
    console.log(body);
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    return this.http.post('http://goyal.azurewebsites.net/api/get_invoice_list.php' , body, {headers: headers});
  }

  deleteInvoiceItem(invoiceNumber: any) {
    const body = JSON.stringify(invoiceNumber);
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    return this.http.post('http://goyal.azurewebsites.net/api/delete_invoice_item.php', body, {headers: headers});
  }

  editInvoiceItem(invoiceToEdit: any){
    const body = JSON.stringify(invoiceToEdit);
    const headers = new Headers();
    console.log(body,"body");

    return this.http.post('http://goyal.azurewebsites.net/api/edit_invoice_item.php', body, {headers: headers});

  }

  saveInvoicePdf(invoicePdf: any){
    const body = invoicePdf;
    const headers = new Headers();
    //console.log(body,"body");

    return this.http.post('http://goyal.azurewebsites.net/api/upload_invoice.php', body, {headers: headers});

  }

  getItems() {
    this.http.get('http://goyal.azurewebsites.net/api/get_items.php').subscribe( (res) => {
      this.items = res.json();
      this.itemsSubject.next(this.items);
      console.log('aa gya data!');
    });
  }

  sendInvoiceMail(mailArray: any)
  {
    const body = mailArray;
    const headers = new Headers();

    return this.http.post('http://goyal.azurewebsites.net/api/upload_invoice.php', body, {headers: headers});
  }

  adjustItem(toAdjust: any) {
    const body = JSON.stringify(toAdjust);
    console.log(body);
    const headers = new Headers();
    return this.http.post('http://goyal.azurewebsites.net/api/item_adjust_quantity.php', body, {headers: headers});
  }

  confirmDemand(demandConfirmData) {
    const body = JSON.stringify(demandConfirmData);
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    console.log(body);
    return this.http.post('http://goyal.azurewebsites.net/api/confirm_demand.php', body, {headers: headers});
  }


  approveTransfer(transferData) {
    const body  = JSON.stringify(transferData);
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    return this.http.post('http://goyal.azurewebsites.net/api/approve_transfer.php', body, {headers: headers});
  }

  editAdminName(newName: any) {
    const body = JSON.stringify(newName);
    console.log(body);
    const headers = new Headers();
    return this.http.post('http://localhost/api/edit_admin_info.php', body, {headers: headers});
  }
  editAdminEmail(newEmail: any) {
    const body = JSON.stringify(newEmail);
    console.log(body);
    const headers = new Headers();
    return this.http.post('http://goyal.azurewebsites.net/api/edit_admin_info.php', body, {headers: headers});
  }
  editAdminPassword(newPassword: any) {
    const body = JSON.stringify(newPassword);
    console.log(body);
    const headers = new Headers();
    return this.http.post('http://goyal.azurewebsites.net/api/edit_admin_info.php', body, {headers: headers});
  }

  sendmail(mailData: any) {
    console.log('mil gya h');
    const body = JSON.stringify(mailData);
    const headers = new Headers();
    return this.http.post('http://goyal.azurewebsites.net/api/mail_invoice.php' , body, {headers: headers});
  }






}
