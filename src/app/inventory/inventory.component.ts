import {Component, EventEmitter, OnInit, ChangeDetectorRef} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import {FormGroup} from '@angular/forms';
import {DataService} from '../services/data.service';
declare var $: any;
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  modalActions = new EventEmitter<string | MaterializeAction>();
  addProductForm: FormGroup;
  adjustProductForm: FormGroup;
  itemData: any;
  dataAvailable: boolean = false;
  warehouseData: any;
  currentIdSelected: any;
  loggedInWarehouse: any;
  inventoryWarehouse: any;
  //typeSelected: any;
  // types = [{title : 'Product', value: 'product'},
  //   {title: 'Service', value: 'service'}];
  itemTemplate = ['Item Type', 'Item Name', 'Item HSN/SAC', 'Selling Price', 'Purchasing Price', 'Tax', 'Available Quantity','Total Worth'];
  // itemFinal: any[] = [];
  toAdd = {
    'item_name': null,
    'item_type': null,
    'item_hsn_sac': null,
    'item_rate': null,
    'item_current_qty': null,
    'item_min_sellingprice': null,
    'item_purchasingprice': null,
    'item_tax': null,
    'item_reorderlevel': null,
    'item_warehouse_id': null,
    'item_add_qty': null,
  };
  toAdjust = {
    'item_name': null,
    'item_type': null,
    'item_hsn_sac': null,
    'item_rate': null,
    'item_current_qty': null,
    'item_min_sellingprice': null,
    'item_purchasingprice': null,
    'item_tax': null,
    'item_warehouse_id': null,
    'item_adjust_qty': null,
    'item_adjust_reason': ''
  };
  netWorth = 0;
  constructor(public _dataService: DataService, private changeDetector: ChangeDetectorRef) {
    this.addProductForm = new FormGroup({});
    this.adjustProductForm = new FormGroup({});
    this.inventoryWarehouse = JSON.parse(localStorage.getItem('auth_user_warehouse')).value;
  }
  ngOnInit() {

    this._dataService.getItems();
    this._dataService.itemsSubject$.subscribe(
      (data) => {
        this.itemData = data;
        this.netWorth = 0;
        for (let i = 0; i < this.itemData.length; i++) {
          if (this.itemData[i].item_type == 'product') {
            // this.itemFinal.push(this.itemData[i]);
            this.netWorth += this.itemData[i][this.inventoryWarehouse] * this.itemData[i].item_purchasingprice;
          }
        }
        // console.log(this.itemFinal,"f");
        // this.itemData = this.itemFinal;
        console.log(this.itemData);
        this.dataAvailable = true;
      });
    this._dataService.getWarehouse().subscribe(
      (data) => {
        this.warehouseData = data.json();
        console.log(this.warehouseData);
      }
    );
    $(document).ready(function(){
      $('select').material_select();
      $('.tooltipped').tooltip({delay: 50});
    });
    // this.loggedInWarehouse = JSON.parse(localStorage.getItem('auth_user_warehouse'));
    // this.inventoryWarehouse = this.loggedInWarehouse.value;

    //this._dataService.getCurrentWarehouse();
    this._dataService.loggedInWarehouse$.subscribe((data) =>
    {
      console.log("bhai data",data)
      this.loggedInWarehouse = data.value;
      //this.loggedInWarehouse = this.loggedInWarehouse.value;
      //console.log(this.loggedInWarehouse,"k");
      this.inventoryWarehouse = this.loggedInWarehouse;
      this.netWorthCalculate();
    });
  }
  // while (this.mixed==false){
  //   if(this.dataAvailable==true&&this.dataQtyAvailable==true)
  //   {
  //     for(var i=0;i<=this.itemData.length;i++)
  //     {
  //         if(this.itemData[i].item_sku ==this.productQuantity[i].item_hsn_sac){
  //           this.itemData[i]["quantity"]=this.productQuantity[i].wh001;
  //         }
  //     }
  //     console.log(this.itemData,"hello");
  //     this.mixed=true;
  //   }
  // };
  addItem() {
    this._dataService.preloaderShow.next(true);
    console.log(this.toAdd);
    this._dataService.addItem(this.toAdd).
    subscribe((data) => {
      this.itemData = [];
      console.log(data,"ji");
      this.itemData = data.json();
      this._dataService.itemsSubject.next(this.itemData);
      console.log(this.itemData);
      this.changeDetector.detectChanges();
      $('.tooltipped').tooltip({delay: 50});
      this._dataService.preloaderShow.next(false);
    });
  }
  adjustItem() {
    this._dataService.preloaderShow.next(true);
    console.log(this.toAdjust);

    this._dataService.adjustItem(this.toAdjust).
    subscribe((data) => {
      this.itemData = data.json();
      console.log(this.itemData);
      this._dataService.itemsSubject.next(this.itemData);
      this.changeDetector.detectChanges();
      $('.tooltipped').tooltip({delay: 50});
      this._dataService.preloaderShow.next(false);
    });
  }
  openaddproductmodal() {
    $('#inventory-component__add-modal').modal('open');
  }
  openadjustproductmodal() {
    $('#inventory-component__adjust-modal').modal('open');
  }
  closeaddproductmodal() {
    $('#inventory-component__add-modal').modal('close');
  }
  closeadjustproductmodal() {
    $('#inventory-component__adjust-modal').modal('close');
  }
  getCurrentProduct_add(event) {
    this.toAdd.item_current_qty = null;
    const temp = event.target.id;
    let id = 0;
    for (let i = 0; i < this.itemData.length; i++) {
      if (this.itemData[i].s_no == temp) {
        id = i;
        break;
      }
    }
    this.currentIdSelected = id;
    this.toAdd.item_warehouse_id = this.inventoryWarehouse;
    this.toAdd.item_name = this.itemData[id].item_name;
    this.toAdd.item_type = this.itemData[id].item_type;
    this.toAdd.item_hsn_sac = this.itemData[id].item_hsn_sac;
    this.toAdd.item_rate = parseInt(this.itemData[id].item_sellingprice, 10);
    this.toAdd.item_min_sellingprice = parseInt(this.itemData[id].item_min_sellingprice, 10);
    this.toAdd.item_purchasingprice = parseInt(this.itemData[id].item_purchasingprice, 10);
    this.toAdd.item_tax = this.itemData[id].item_tax;
    this.toAdd.item_current_qty = this.itemData[id][this.inventoryWarehouse];
    this.toAdd.item_reorderlevel = this.itemData[id].item_reorderlevel;
    this.toAdd.item_add_qty = 0;
  }
  getCurrentProduct_adjust(event) {
    this.toAdjust.item_current_qty = null;
    const temp = event.target.id;
    let id = 0;
    for (let i = 0; i < this.itemData.length; i++) {
      if (this.itemData[i].s_no == temp) {
        id = i;
        break;
      }
    }
    this.currentIdSelected = id;
    this.toAdjust.item_warehouse_id = this.inventoryWarehouse;
    this.toAdjust.item_name = this.itemData[id].item_name;
    this.toAdjust.item_type = this.itemData[id].item_type;
    this.toAdjust.item_hsn_sac = this.itemData[id].item_hsn_sac;
    this.toAdjust.item_rate = parseInt(this.itemData[id].item_sellingprice, 10);
    this.toAdjust.item_min_sellingprice = parseInt(this.itemData[id].item_min_sellingprice, 10);
    this.toAdjust.item_purchasingprice = parseInt(this.itemData[id].item_purchasingprice, 10);
    this.toAdjust.item_tax = this.itemData[id].item_tax;
    this.toAdjust.item_current_qty = this.itemData[id][this.inventoryWarehouse];
    this.toAdjust.item_adjust_qty = 0;
    this.toAdjust.item_adjust_reason = '';
  }


  netWorthCalculate(){
    this.netWorth = 0;
    for (let i = 0; i < this.itemData.length; i++) {
      if (this.itemData[i].item_type == 'product') {
        this.netWorth += this.itemData[i][this.inventoryWarehouse] * this.itemData[i].item_purchasingprice;
      }
    }
  }


  refreshItemList(){
    this._dataService.preloaderShow.next(true);
    this._dataService.getItems();
    this._dataService.itemsSubject$.subscribe(
      (data) => {
        this.itemData = data;
        this.netWorth = 0;
        for (let i = 0; i < this.itemData.length; i++) {
          if (this.itemData[i].item_type == 'product') {
            // this.itemFinal.push(this.itemData[i]);
            this.netWorth += this.itemData[i][this.inventoryWarehouse] * this.itemData[i].item_purchasingprice;
          }
        }
        // console.log(this.itemFinal,"f");
        // this.itemData = this.itemFinal;
        console.log(this.itemData);
        this.dataAvailable = true;
        this._dataService.preloaderShow.next(false);
      });

  }

}
