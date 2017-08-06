import {ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {DataService} from "../services/data.service";
import { NgStyle } from '@angular/common';
import {Subject} from "rxjs/Subject";
declare var $: any;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  public loggedIn: boolean = false;
  public loggedInUser: any;
  public loggedInUserWarehouse = 'laura';
  public loginDataAvailable: boolean = false;
  public warehouseSelection: any = false;
  public errorMessage: any = false;
  imglink = "../../assets/img/waterfall.jpg";
  // whs = [{title: 'Warehouse 1', value: 'wh001'},
  //   {title: 'Warehouse 2', value: 'wh002'},
  //   {title: 'Warehouse 3', value: 'wh003'},
  //   {title: 'Warehouse 4', value: 'wh004'},
  //   {title: 'Warehouse 5', value: 'wh005'}];
  warehouseList:any=[];

  whs:any=[];
  user:any;
  constructor(public _authService: AuthService, private router: Router, public _dataService: DataService, private chgRef: ChangeDetectorRef) {

    //this._authService.user$.subscribe((res)=>this.user = res);
    this._authService.loggedInUserSubject$.subscribe((res)=>{this.loggedInUser = res;});

    this.loginForm = new FormGroup({
      'auth_email' : new FormControl('', [
        Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
      'auth_password' : new FormControl('', Validators.required),
    });

    this._authService.warehouseListSubject$
      .subscribe((data)=> {
          this.warehouseList = data;
          console.log("ware",this.warehouseList);
          for(var i=0;i<this.warehouseList.length;i++){
            // this.whs1[i].title=this.warehouseList[i].wh_warehouse_name;
            // this.whs1[i].value=this.warehouseList[i].wh_id;
            this.whs[i]={title:this.warehouseList[i].wh_warehouse_name,value:this.warehouseList[i].wh_id};
          }
          console.log("whs",this.whs);
        });

    this._authService.loginDataAvailable$.subscribe((res)=>{
      this.loginDataAvailable = res;
      console.log(this.loginDataAvailable,"authcomp")

    });



    this._authService.warehouseSelection$.subscribe(res => this.warehouseSelection = res);
    this._authService.errorMessage$.subscribe((res)=>this.errorMessage = res);

    //this._authService.warehouseSelection.subscribe((res)=>this.warehouseSelection = res);

    //this.subscription3 =  this._authService.loggedInUserObservable.subscribe( res => this.loggedInUser = res );





  }
  ngOnInit() {
    $(document).ready(function(){
      $('select').material_select();
      $('.warehouseSelection').css('display', 'none');
    });

    this._authService.getWarehouseList();
    this._authService.warehouseListSubject$.subscribe((data)=>{
      this.warehouseList = data;
      console.log(this.warehouseList, "mil gya component me!");
    })

    var loggedIn = localStorage.getItem('auth_user');
    if(loggedIn!=null)
    {
      this.router.navigateByUrl("admin");
    }


    // $('#auth_warehouse').on('change', function() {
    //   this.loggedInUserWarehouse = $(this)[0].value;
    //   console.log(this.loggedInUserWarehouse);
    // this._dataService.setLoggedInWarehouse(this.loggedInUserWarehouse);
    // this.router.navigateByUrl('admin');
    // });
  }

  // getUsers(){
  //   console.log("called");
  //   this._authService.getUsers();
  // }


  login() {
    this._authService.login({email_id: this.loginForm.value.auth_email,password: this.loginForm.value.auth_password});
    console.log("called");
    // while(this.loggedInUser[0]!=null)
    // {
    //   console.log(this.loginDataAvailable);
    //   if(this.loggedInUser[0] == "Invalid Credentials"){
    //     this.errorMessage = true;
    //   }
    // }
    // this.errorMessage = false;
    // this.warehouseSelection = false;
    // this._authService.login({email_id: this.loginForm.value.auth_email,
    //   password: this.loginForm.value.auth_password}).
    // subscribe(
    //   (data) => {
    //     this.loggedInUser = data.json();
    //     console.log(this.loggedInUser);
    //     this.loginDataAvailable = true;
    //     if (this.loggedInUser[0].user_role == 'admin' || 'wh_manager') {
    //        this.warehouseSelection = true;
    //       $('.warehouseSelection').css('display', 'block');
    //     }
    //     else if (this.loggedInUser[0] == "Invald Credentials"){
    //       // $('body').alert("Not authorized!");
    //       this.errorMessage = true;
    //     }
    //     // if (this.loggedInUser[0].s_no) {
    //     //   if (this.loggedInUser[0].warehouse) {
    //     //     this.router.navigateByUrl('admin');
    //     //   }
    //     //   else {
    //     //     this.warehouseSelection = true;
    //     //   }
    //     // }
    //     // else {
    //     //   this.errorMessage = true;
    //     // }
    //   });
  }

  gotoDashboard() {
    localStorage.setItem('auth_user', JSON.stringify(this.loggedInUser));
    for(var i=0;i<this.whs.length;i++){
      if(this.loggedInUserWarehouse==this.whs[i].value){
        this.loggedInUserWarehouse=JSON.stringify(this.whs[i]);
      }
    }
    localStorage.setItem('auth_user_warehouse', this.loggedInUserWarehouse);
    // this._dataService.setLoggedInUser(this.loggedInUser);
    // console.log(this.loggedInUser);
    // this._dataService.setLoggedInWarehouse(this.loggedInUserWarehouse);
    // console.log(this.loggedInUserWarehouse);
    this._authService.loggedIn.next(true);
    this.router.navigateByUrl('admin');
  }
}
