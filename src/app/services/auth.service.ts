import {Injectable, OnInit} from '@angular/core';
import {Http,Headers} from "@angular/http";
import {Subject} from "rxjs/Subject";
import {Router} from "@angular/router";

@Injectable()
export class AuthService implements OnInit{
  public loggedInUser: any;
  loginDataAvailable = new Subject<any>();
  loginDataAvailable$  = this.loginDataAvailable.asObservable();
  warehouseSelection = new Subject<any>();
  warehouseSelection$  = this.warehouseSelection.asObservable();
  loggedInUserSubject = new Subject<any>();
  loggedInUserSubject$  = this.loggedInUserSubject.asObservable();
  errorMessage = new Subject<any>();
  errorMessage$  = this.errorMessage.asObservable();
  loggedIn = new Subject<any>();
  loggedIn$ = this.loggedIn.asObservable();
  //currentAvailable = this.loginDataAvailable.asObservable();
  private available: boolean = false;

  constructor(private http:Http, public router: Router) {

    //this.loggedInUserToEmit = new EventEmitter();
  }

  ngOnInit(){
      this.warehouseListSubject$.subscribe((data)=>{
        this.warehouseList = data;
      });
  }

  user = new Subject<any>();
  a: number=1;
  user$ = this.user.asObservable();

  warehouseList:any=[];
  warehouseListSubject = new Subject<any>();
  warehouseListSubject$ = this.warehouseListSubject.asObservable();






  login(loginData:any)
  {
    this.loginDataAvailable.next(false);
    const body = JSON.stringify(loginData);
    const headers = new Headers();
    //console.log("authservice " + body);
    this.http.post("http://goyal.azurewebsites.net/api/login.php",body,{headers:headers})
      .subscribe((data)=>{
      this.loggedInUser = data.json();
      console.log(this.loggedInUser[0],"himanhu");
      this.loggedInUserSubject.next(this.loggedInUser);
      this.loginDataAvailable.next(true);
        if (this.loggedInUser[0].user_role == 'admin' || this.loggedInUser[0].user_role == 'whmanager') {
          this.warehouseSelection.next(true);
          this.errorMessage.next(false);
          //$('.warehouseSelection').css('display', 'block');
        }
        else if(this.loggedInUser[0] == "Invalid Credentials"){
          // $('body').alert("Not authorized!");
          console.log("yaha aaya hu");
          this.warehouseSelection.next(false);
          this.errorMessage.next(true);
        }else if(this.loggedInUser[0].user_role == 'officeperson'){
          console.log('ghusa hi nhi bc!');
          for(let i = 0;i< this.warehouseList.length;i++){
            if(this.loggedInUser[0].user_warehouse == this.warehouseList[i].wh_warehouse_name) {

              localStorage.setItem('auth_user_warehouse', JSON.stringify({title: this.warehouseList[i].wh_warehouse_name,
                value: this.loggedInUser[0].user_warehouse}));
            }
          }



          localStorage.setItem('auth_user', JSON.stringify(this.loggedInUser));

          this.router.navigateByUrl('admin');
        }
    });
    //   .map(
    //   (data) => {
    // this.loggedInUser = data.json();
    // console.log(this.loggedInUser,"k");
    // //this.loggedInUserToEmit.emit(this.loggedInUser);
    //
    // console.log(this.loginDataAvailable,"service");
    //
    //   });
    // this.loginDataAvailable.next(false);
    // this.loggedInUserSubject.next(this.loggedInUser);
    // this.warehouseSelection.next(true);
        // if (this.loggedInUser[0].user_role == 'admin' || '') {
        //
        //         $('.warehouseSelection').css('display', 'block');
        //         // this.router.navigateByUrl('admin');
        //       }
        //       else{
        //         // $('body').alert("Not authorized!");
        //         this.errorMessage = true;
        //       }



  }




  getWarehouseList()
  {
    this.http.get("http://goyal.azurewebsites.net/api/get_warehouse.php").subscribe((data)=>{
      this.warehouseList = data.json();
      console.log(this.warehouseList);
      this.warehouseListSubject.next(this.warehouseList);
    });
  }



}
