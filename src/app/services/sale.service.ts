import {Injectable, OnInit} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable, Subject} from "rxjs";

import 'rxjs/add/operator/map';

@Injectable()
export class SaleService implements OnInit{

  invoiceNumber = new Subject<any>();
  invoiceNumber$ = this.invoiceNumber.asObservable();

  items = new Subject<any>();
  items$ = this.items.asObservable();

  constructor(private http:Http) { this.getInvoiceNumber(); }

  ngOnInit(){

  }

  getAllItems(){

    this.http.get("http://goyal.azurewebsites.net/api/get_items.php")
      .subscribe(res=>{
        var data = res.json();
        console.log(data,"aaj");
        this.items.next(data);
      });
  }



  completeTransaction(itemData: any){

      const body = JSON.stringify(itemData);
    console.log(body,"res");
      const headers = new Headers();
     return this.http.post("http://goyal.azurewebsites.net/api/complete_transaction.php", body, {headers: headers});
  }


  updateInvoiceNumber(invoiceNumber: any)
  {

    const body = JSON.stringify(invoiceNumber);
    console.log(body,"res");

    const headers = new Headers();
    return this.http.post("http://goyal.azurewebsites.net/api/update_invoice_number.php", body, {headers: headers}).subscribe((data)=>{
      var inv = data.json();
      inv  = inv[0].invoice_number;
      inv++;
      console.log(inv,"updateInv");
      this.invoiceNumber.next(inv);
    });

  }


    getInvoiceNumber()
    {
      this.http.get('http://goyal.azurewebsites.net/api/get_invoice_number.php').subscribe((data)=>
      {
        var inv = data.json();
        inv  = inv[0].invoice_number;
        inv++;
        this.invoiceNumber.next(inv);
      });
    }

}
