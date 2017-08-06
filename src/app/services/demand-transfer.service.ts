import {Injectable, OnInit} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Subject} from "rxjs/Subject";

@Injectable()
export class DemandTransferService implements OnInit{
  pendingCount =0;
  loggedInWarehouse = new Subject<any>();
  loggedInWarehouse$ = this.loggedInWarehouse.asObservable();
  pendingCountSubject = new Subject<any>();
  pendingCountSubject$ = this.pendingCountSubject.asObservable();

  transferOrderData: any;
  transferOrderDataSubject  = new Subject<any>();
  transferOrderDataSubject$  = this.transferOrderDataSubject.asObservable();
  constructor(public http:Http) {

  }

    ngOnInit()
    {
      this.getCurrentWarehouse();

    }

  getTransferOrder() {
    const body = JSON.stringify({warehouse: JSON.parse(localStorage.getItem('auth_user_warehouse')).value});
    const headers = new Headers();
    // headers.append('Content-Type' , 'application/json');
    this.http.post('http://goyal.azurewebsites.net/api/get_transfer_order.php' , body, {headers: headers}).subscribe((res)=>{

      this.transferOrderData = res.json();
      console.log(this.transferOrderData,"pend");
      this.transferOrderDataSubject.next(this.transferOrderData);

      for (let i = 0; i < this.transferOrderData.length; i++) {
        if (this.transferOrderData[i].transfer_item_status == 'pending') {
          this.pendingCount++;
          console.log(this.pendingCount,"pend");

        }
      }
      this.pendingCountSubject.next(this.pendingCount);
    });
  }

  getCurrentWarehouse()
  {
    this.loggedInWarehouse.next(JSON.parse(localStorage.getItem('auth_user_warehouse')));
  }
}
