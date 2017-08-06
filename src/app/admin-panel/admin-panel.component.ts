import {Component, EventEmitter, OnInit} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router,RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Subject} from "rxjs";
import {DataService} from "../services/data.service";
import {DemandTransferService} from "../services/demand-transfer.service";
declare var $:any;
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  modalActions = new EventEmitter<string|MaterializeAction>();
  whmanagerForm: FormGroup;
  userForm: FormGroup;
  // whForm: FormGroup;
  itemForm: FormGroup;
  rotateButton:boolean=false;
  loggedInUser : any;
  loggedInUserWarehouse : any;
  saluts = [{title : 'Mr.', value: 'mr'},
    {title: 'Mrs.', value: 'mrs'}];
  types = [{title : 'Product', value: 'product'},
    {title: 'Service', value: 'service'}];
  taxes = [{title : '0%', value: '0%'},
    {title : '5%', value: '5%'},
    {title : '12%', value: '12%'},
    {title : '18%', value: '18%'},
    {title : '28%', value: '28%'}];
  user_roles = [{title : 'Office Person', value: 'officeperson'},
    {title: 'Marketing Person', value: 'marketingperson'},
    {title: 'Customer', value: 'customer'}];
  states = [{title: 'Madhya Pradesh', value: 'mp'},
    {title: 'Bihar', value: 'bihar'}];

// {
//   "AP":"Andhra Pradesh",
//   "AR":"Arunachal Pradesh",
//   "AS":"Assam",
//   "BR":"Bihar",
//   "CG":"Chhattisgarh",
//   "Chandigarh":"Chandigarh",
//   "DN":"Dadra and Nagar Haveli",
//   "DD":"Daman and Diu",
//   "DL":"Delhi",
//   "GA":"Goa",
//   "GJ":"Gujarat",
//   "HR":"Haryana",
//   "HP":"Himachal Pradesh",
//   "JK":"Jammu and Kashmir",
//   "JH":"Jharkhand",
//   "KA":"Karnataka",
//   "KL":"Kerala",
//   "MP":"Madhya Pradesh",
//   "MH":"Maharashtra",
//   "MN":"Manipur",
//   "ML":"Meghalaya",
//   "MZ":"Mizoram",
//   "NL":"Nagaland",
//   "OR":"Orissa",
//   "PB":"Punjab",
//   "PY":"Pondicherry",
//   "RJ":"Rajasthan",
//   "SK":"Sikkim",
//   "TN":"Tamil Nadu",
//   "TR":"Tripura",
//   "UP":"Uttar Pradesh",
//   "UK":"Uttarakhand",
//   "WB":"West Bengal"
// }


  countries = [{title: 'India', value: 'india'},
    {title: 'USA', value: 'usa'}];
  preloader: boolean = false;
  pendingCount = 0;
  whs : any[] = [];
  warehouseList: any;
  item_type: any;
  item_tax: any;

  constructor(public _demandtransferService:DemandTransferService ,private router : Router, private _authService: AuthService, private _dataService: DataService) {

    this.whmanagerForm = new FormGroup({
      'whmanager_salutation':new FormControl('', Validators.required),
      'whmanager_name':new FormControl('', Validators.required),
      // 'whmanager_role':new FormControl('', Validators.required),
      'whmanager_email':new FormControl('', [Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
      'whmanager_password':new FormControl('', Validators.required),
      'whmanager_address':new FormControl('', Validators.required),
      'whmanager_contact':new FormControl('', Validators.required),
    });
    this.userForm = new FormGroup({
      'user_salutation':new FormControl('', Validators.required),
      'user_name':new FormControl('', Validators.required),
      'user_email':new FormControl('', [Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
      'user_password':new FormControl('', Validators.required),
      'user_role':new FormControl('', Validators.required),
      'user_wh':new FormControl('', Validators.required),
      'user_address':new FormControl('', Validators.required),
      'user_city':new FormControl('', Validators.required),
      'user_state':new FormControl('', Validators.required),
      'user_zipcode':new FormControl('', Validators.required),
      'user_country':new FormControl('', Validators.required),
      'user_contact':new FormControl('', Validators.required)
    });
    // this.whForm = new FormGroup({
    //   'wh_warehouse':new FormControl('', Validators.required),
    //   'wh_email':new FormControl('', Validators.required),
    //   'wh_address':new FormControl('', Validators.required),
    //   'wh_contact':new FormControl('', Validators.required)
    // });
    this.itemForm = new FormGroup({
      'item_type':new FormControl(''),
      'item_name':new FormControl('', Validators.required),
      'item_hsn_sac':new FormControl('', Validators.required),
      'item_manufacturer':new FormControl('', Validators.required),
      'item_brand':new FormControl('', Validators.required),
      'item_upc':new FormControl('', Validators.required),
      'item_tax':new FormControl(''),
      'item_sellingprice':new FormControl('', Validators.required),
      'item_min_sellingprice':new FormControl('', Validators.required),
      'item_purchasingprice':new FormControl('', Validators.required),
      'item_reorderlevel':new FormControl('', Validators.required),
    });
  }
  ngOnInit() {


    $(document).ready(function(){
      $('ul.tabs').tabs();
      $('select').material_select();
      $(".dropdown-button").dropdown({ hover: false, constrainWidth: false });
    });
    this._dataService.preloaderShow.next(false);
    this.loggedInUser = JSON.parse(localStorage.getItem('auth_user'));
    this.loggedInUserWarehouse = JSON.parse(localStorage.getItem('auth_user_warehouse'));
    console.log(this.loggedInUserWarehouse,"log");
    this._dataService.preloaderShow$.subscribe((data)=>{
      this.preloader = data;
    });
    this._demandtransferService.pendingCountSubject$.subscribe((data)=>{
      this.pendingCount = data;
    });


    this._authService.getWarehouseList();
    this._authService.warehouseListSubject$.subscribe((data)=>{
      this.warehouseList = data;
      console.log("ware",this.warehouseList);
      for(var i=0;i<this.warehouseList.length;i++){
        this.whs[i]={title:this.warehouseList[i].wh_warehouse_name,value:this.warehouseList[i].wh_id};
      }
      console.log("whs",this.whs);
    })

  }



  // Opening Modal
  openwhmanagermodal() {
    $('#admin-component__whmanager-modal').modal('open');
  }
  openusermodal() {
    $('#admin-component__user-modal').modal('open');
  }
  // openwhmodal() {
  //   $('#admin-component__wh-modal').modal('open');
  // }
  openitemmodal() {
    $('#admin-component__item-modal').modal('open');
  }
  // Closing Modal
  closewhmanagermodal() {
    $('#admin-component__whmanager-modal').modal('close');
    this.resetWhmanager();
  }
  closeusermodal() {
    $('#admin-component__user-modal').modal('close');
    this.resetUser();
  }
  // closewhmodal() {
  //   $('#admin-component__wh-modal').modal('close');
  // }
  closeitemmodal() {
    $('#admin-component__item-modal').modal('close');
    this.resetItem();
  }
  resetWhmanager() {
    $('#whmanager_salutation').val('');
    $('#whmanager_name').val(null).removeClass('valid');
    $('#whmanager_email').val(null).removeClass('valid');
    $('#whmanager_password').val(null).removeClass('valid');
    $('#whmanager_warehouse').val('');
    $('#whmanager_address').val(null).removeClass('valid');
    $('#whmanager_contact').val(null).removeClass('valid');
  }
  resetUser() {
    $('#user_salutation').val('');
    $('#user_name').val(null).removeClass('valid');
    $('#user_email').val(null).removeClass('valid');
    $('#user_password').val(null).removeClass('valid');
    $('#user_role').val('');
    $('#user_wh').val('');
    $('#user_address').val(null).removeClass('valid');
    $('#user_city').val(null).removeClass('valid');
    $('#user_state').val('');
    $('#user_zipcode').val(null).removeClass('valid');
    $('#user_country').val('');
    $('#user_contact').val(null).removeClass('valid');
  }
  // resetWh() {
  //   $('#wh_warehouse_name').val(null).removeClass('valid');
  //   $('#wh_email').val(null).removeClass('valid');
  //   $('#wh_address').val(null).removeClass('valid');
  //   $('#wh_contact').val(null).removeClass('valid');
  // }
  resetItem() {
    $('#item_type').val('');
    $('#item_name').val(null).removeClass('valid');
    $('#item_hsn_sac').val(null).removeClass('valid');
    $('#item_manufacturer').val(null).removeClass('valid');
    $('#item_brand').val(null).removeClass('valid');
    $('#item_upc').val(null).removeClass('valid');
    $('#item_sellingprice').val(null).removeClass('valid');
    $('#item_min_sellingprice').val(null).removeClass('valid');
    $('#item_purchasingprice').val(null).removeClass('valid');
    $('#item_tax').val(null).removeClass('valid');
    $('#item_reorderlevel').val(null).removeClass('valid');
    $('#item_openingstock').val(null).removeClass('valid');
  }

  whmanagerFormSubmit() {
    console.log(this.whmanagerForm.value);
    this._dataService.preloaderShow.next(true);
    this._dataService.createWhmanager({
      whmanager_salutation: this.whmanagerForm.value.whmanager_salutation,
      whmanager_name: this.whmanagerForm.value.whmanager_name,
      whmanager_email: this.whmanagerForm.value.whmanager_email,
      whmanager_password: this.whmanagerForm.value.whmanager_password,
      whmanager_address: this.whmanagerForm.value.whmanager_address,
      whmanager_contact: this.whmanagerForm.value.whmanager_contact
    }).subscribe( data => {
      console.log(data.json());
      this._dataService.preloaderShow.next(false);
    });
    this.resetWhmanager();
    this.whmanagerForm.reset();
  }
  userFormSubmit() {
    console.log(this.userForm.value);
    this._dataService.preloaderShow.next(true);
    this._dataService.createUser({
      user_salutation: this.userForm.value.user_salutation,
      user_name: this.userForm.value.user_name,
      user_email: this.userForm.value.user_email,
      user_password: this.userForm.value.user_password,
      user_role: this.userForm.value.user_role,
      user_warehouse: this.userForm.value.user_wh,
      user_address: this.userForm.value.user_address,
      user_city: this.userForm.value.user_city,
      user_state: this.userForm.value.user_state,
      user_zipcode: this.userForm.value.user_zipcode,
      user_country: this.userForm.value.user_country,
      user_contact: this.userForm.value.user_contact
    } , this.userForm.value.user_role).subscribe( data => {
      console.log(data.json());
      this._dataService.preloaderShow.next(false);
    });
    this.resetUser();
    this.userForm.reset();
  }
  // whFormSubmit() {
  //   console.log(this.whForm.value);
  //   this._dataService.createWh({
  //     wh_warehouse_name: this.whForm.value.wh_warehouse_name,
  //     wh_email: this.whForm.value.wh_email,
  //     wh_address: this.whForm.value.wh_address,
  //     wh_contact: this.whForm.value.wh_contact
  //   }).subscribe( data => {
  //     console.log(data.json());
  //   });
  //   this.resetWh();
  //   this.whForm.reset();
  // }
  itemFormSubmit() {
    this._dataService.preloaderShow.next(true);
    console.log(this.itemForm.value);
    this._dataService.createItem({
      item_type: this.itemForm.value.item_type,
      item_name: this.itemForm.value.item_name,
      item_hsn_sac: this.itemForm.value.item_hsn_sac,
      item_manufacturer: this.itemForm.value.item_manufacturer,
      item_brand: this.itemForm.value.item_brand,
      item_upc: this.itemForm.value.item_upc,
      item_sellingprice: this.itemForm.value.item_sellingprice,
      item_min_sellingprice: this.itemForm.value.item_min_sellingprice,
      item_purchasingprice: this.itemForm.value.item_purchasingprice,
      item_tax: this.itemForm.value.item_tax,
      item_reorderlevel: this.itemForm.value.item_reorderlevel
    }).subscribe( data => {
      console.log(data.json());
      this._dataService.preloaderShow.next(false);
    });
    this.resetItem();
    this.itemForm.reset();
  }







  rotate() {
    if (this.rotateButton == false) {
      $('.quick-add-btn').removeClass('anti-rotated');
      $('.quick-add-btn').addClass('rotated');
      this.rotateButton = true;
    }
    else {
      $('.quick-add-btn').removeClass('rotated');
      $('.quick-add-btn').addClass('anti-rotated');
      this.rotateButton = false;
    }
  }


  clearbadge() {
    $('.countBadge').css('display', 'none');
  }

  logOut(){
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_user_warehouse');
    this.router.navigateByUrl('/auth');
  }

  getWarehouseList(){

    this.warehouseList = this._authService.warehouseList;

    // this._authService.warehouseListSubject$
    //   .subscribe(
    //     (data)=> {
    //       console.log("list h");
    //       this.warehouseList = data;
          console.log("ware",this.warehouseList);
          for(var i=0;i<this.warehouseList.length;i++){
            this.whs[i]={title:this.warehouseList[i].wh_warehouse_name,value:this.warehouseList[i].wh_id};
          }
          console.log("whs",this.whs);



  }

  changeWarehouse()
  {
    localStorage.removeItem('auth_user_warehouse');

    for(var i=0;i<this.whs.length;i++){
      if(this.loggedInUserWarehouse == this.whs[i].value){
        this.loggedInUserWarehouse = JSON.stringify(this.whs[i]);
      }
    }
    localStorage.setItem('auth_user_warehouse', this.loggedInUserWarehouse);
    this.loggedInUserWarehouse = JSON.parse(localStorage.getItem('auth_user_warehouse'));
    this._dataService.loggedInWarehouse.next(this.loggedInUserWarehouse);
  }

  display(){
    console.log(this.item_type,"y");
  }

}
