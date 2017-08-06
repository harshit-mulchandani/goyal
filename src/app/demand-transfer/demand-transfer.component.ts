import {ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {MaterializeAction} from "angular2-materialize";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../services/data.service";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {DemandTransferService} from "../services/demand-transfer.service";
declare var $: any;
@Component({
  selector: 'app-demand-transfer',
  templateUrl: './demand-transfer.component.html',
  styleUrls: ['./demand-transfer.component.css']
})
export class DemandTransferComponent implements OnInit {
  modalActions = new EventEmitter<string|MaterializeAction>();
  demandOrderForm: FormGroup;
  demandOrderData: any;
  transferOrderData: any;
  loggedInUser: any;
  loggedInWarehouse: any;
  demandOrderConfirmData: any;
  selectedTransferOrder: any;
  warehouseData: any[] = [];
  itemData: any;
  items: any[] = [];
  toAddItem = {
    item_name: null,
    item_hsn_sac: null
  };
  pendingCount = 0;

  transferOrderApproveData = {
    transfer_id: null,
    transfer_item_name: null,
    transfer_item_type: null,
    transfer_item_hsn_sac: null,
    transfer_item_reqby: null,
    transfer_item_reqquantity: null,
    transfer_item_currentquantity: null,
    transfer_item_rate: null,
    transfer_item_min_sellingprice: null,
    transfer_item_purchasingprice: null,
    transfer_item_tax: null
  };
  demand_item_rate: any;
  demand_item_min_sellingprice: any;
  demand_item_purchasingprice: any;
  demand_item_tax: any;
  confirm_demand_item_rate: any;
  confirm_demand_item_min_sellingprice: any;
  confirm_demand_item_purchasingprice: any;
  confirm_demand_item_tax: any;
  constructor(public _demandTransferService: DemandTransferService, public _dataService: DataService, private router: Router, private changeDetector: ChangeDetectorRef) {
    this.demandOrderForm = new FormGroup({
      'demand_item_type': new FormControl('', Validators.required),
      'demand_item_name': new FormControl('', Validators.required),
      'demand_item_hsn_sac': new FormControl('', Validators.required),
      'demand_item_reqfrom': new FormControl('', Validators.required),
      'demand_item_quantity': new FormControl('', Validators.required)
    });
  }
  ngOnInit() {
    this.loggedInWarehouse = JSON.parse(localStorage.getItem('auth_user_warehouse'));
   // ------------------- Change Warehouse ---------------------------------- //
    this._dataService.loggedInWarehouse$.subscribe((data)=>{
      this.loggedInWarehouse = data;
      this._dataService.getDemandOrder({warehouse: this.loggedInWarehouse.value}).subscribe(
        (data) => {
          this.demandOrderData = data.json();
          console.log(this.demandOrderData);
        });
      this._demandTransferService.getTransferOrder();
      this._demandTransferService.transferOrderDataSubject$.subscribe((data)=>{
        this.transferOrderData = data;
      });

    });
   // -------------------                  ---------------------------------- //
    console.log(this.loggedInWarehouse);
    this.loggedInUser = JSON.parse(localStorage.getItem('auth_user'));
    console.log(this.loggedInUser);
    this._dataService.itemsSubject$.subscribe(
      (data) => {
        this.itemData = data;
        console.log(this.itemData);
        for (let i = 0; i < this.itemData.length; i++) {
          this.items.push(this.itemData[i].item_name);
        }
        console.log(this.items);
      });
    this._dataService.getWarehouse().subscribe(
      (data) => {
        const temp = data.json();
        for ( let i = 0; i < temp.length; i++) {
          if (temp[i].wh_id != this.loggedInWarehouse.value) {
            this.warehouseData.push(temp[i]);
          }
        }
        console.log(this.warehouseData);
      }
    );
    this._dataService.getDemandOrder({warehouse: this.loggedInWarehouse.value}).subscribe(
      (data) => {
        this.demandOrderData = data.json();
        console.log(this.demandOrderData);
      });
    this._demandTransferService.getTransferOrder();
    this._demandTransferService.transferOrderDataSubject$.subscribe((data)=>{
      this.transferOrderData = data;
    });
    // this._demandTransferService.loggedInWarehouse$.subscribe(
    //   (data) => {
    //     this.loggedInWarehouse = data;
    //   });

  }
  // add() {
  //   var currentVal = parseInt($('.transfer_item_sent').val(), 10);
  //   if (!isNaN(currentVal)) {
  //     $('.transfer_item_sent').val(currentVal + 1);
  //   }
  // }
  //
  // remove() {
  //   var $qty = $(this).closest('p').find('.qty');
  //   var currentVal = parseInt($qty.val(), 10);
  //   if (!isNaN(currentVal) && currentVal > 0) {
  //     $qty.val(currentVal - 1);
  //   }
  // }
  onSelectItem () {
    const temp = this.toAddItem.item_name;
    for (let i = 0; i < this.itemData.length; i++) {
      if (temp == this.itemData[i].item_name) {
        this.toAddItem.item_hsn_sac = this.itemData[i].item_hsn_sac;
        break;
      }
    }
    console.log(temp);
    console.log(this.toAddItem.item_hsn_sac);
  }
  refresh() {

    this._dataService.preloaderShow.next(true);
    this._dataService.getDemandOrder({warehouse: this.loggedInWarehouse.value}).subscribe(
      (data) => {
        this.demandOrderData = data.json();
        console.log(this.demandOrderData);
        this._dataService.preloaderShow.next(false);
      });
    this._demandTransferService.getTransferOrder();
    this._demandTransferService.transferOrderDataSubject$.subscribe((data) => {
      this.transferOrderData = data;

    });
  }

  opendemandmodal() {
    $('#demand-transfer__demand-modal').modal('open');
  }
  opentransferapprovemodal(event) {
    $('#demand-transfer__transfer-approve-modal').modal('open');
    const id = event.target.id;
    // this.transferItemSent = this.transferOrderApproveData.transfer_item_reqquantity;
    // console.log(this.transferOrderApproveData);
    this.transferOrderApproveData.transfer_id = this.transferOrderData[id].transfer_id;
    this.selectedTransferOrder = this.transferOrderApproveData.transfer_id;
    this.transferOrderApproveData.transfer_item_name = this.transferOrderData[id].transfer_item_name;
    this.transferOrderApproveData.transfer_item_type = this.transferOrderData[id].transfer_item_type;
    this.transferOrderApproveData.transfer_item_hsn_sac = this.transferOrderData[id].transfer_item_hsn_sac;
    this.transferOrderApproveData.transfer_item_reqby = this.transferOrderData[id].transfer_item_reqby;
    this.transferOrderApproveData.transfer_item_reqquantity = this.transferOrderData[id].transfer_item_reqquantity;
    for (let i = 0; i < this.itemData.length; i++) {
      if (this.itemData[i].item_hsn_sac == this.transferOrderData[id].transfer_item_hsn_sac) {
        this.transferOrderApproveData.transfer_item_rate = this.itemData[i].item_sellingprice;
        this.transferOrderApproveData.transfer_item_min_sellingprice = this.itemData[i].item_min_sellingprice;
        this.transferOrderApproveData.transfer_item_purchasingprice = this.itemData[i].item_purchasingprice;
        this.transferOrderApproveData.transfer_item_tax = this.itemData[i].item_tax;
        break;
      }
    }
    for (let i = 0; i < this.itemData.length; i++) {
      if (this.itemData[i].item_hsn_sac == this.transferOrderData[id].transfer_item_hsn_sac) {
        this.transferOrderApproveData.transfer_item_currentquantity = this.itemData[i][this.loggedInWarehouse.value];
        console.log(this.transferOrderApproveData.transfer_item_currentquantity);
        break;
      }
    }
    // $('.transfer_item_name').html(this.transferOrderApproveData.transfer_item_name);
    // $('.transfer_item_type').html('<p>' + this.transferOrderApproveData.transfer_item_type + '</p>');
    // $('.transfer_item_hsn_sac').html('<p>' + this.transferOrderApproveData.transfer_item_hsn_sac + '</p>');
    // $('.transfer_item_reqby').html('<p>' + this.transferOrderApproveData.transfer_item_reqby + '</p>');
    // $('.transfer_item_reqquantity').html('<p>' + this.transferOrderApproveData.transfer_item_reqquantity + '</p>');
    console.log(this.transferOrderApproveData);
    $('#transfer_item_sent_label').addClass('active');
  }
  closedemandmodal() {
    $('#demand-transfer__demand-modal').modal('close');
    this.demandOrderForm.reset();
  }
  closetransferapprovemodal() {
    $('#demand-transfer__transfer-approve-modal').modal('close');
  }
  demandOrderFormSubmit() {
    console.log(this.demandOrderForm.value);
    for (let i = 0; i < this.itemData.length; i++) {
      if (this.itemData[i].item_hsn_sac == this.demandOrderForm.value.demand_item_hsn_sac) {
        this.demand_item_rate = this.itemData[i].item_sellingprice;
        this.demand_item_min_sellingprice = this.itemData[i].item_min_sellingprice;
        this.demand_item_purchasingprice = this.itemData[i].item_purchasingprice;
        this.demand_item_tax = this.itemData[i].item_tax;
      }
    }
    this._dataService.createDemandOrder({
      demand_item_type: "product",
      demand_item_name: this.demandOrderForm.value.demand_item_name,
      demand_item_hsn_sac: this.demandOrderForm.value.demand_item_hsn_sac,
      demand_item_reqfrom: this.demandOrderForm.value.demand_item_reqfrom,
      demand_item_quantity: this.demandOrderForm.value.demand_item_quantity,
      demand_item_rate: this.demand_item_rate,
      demand_item_min_sellingprice: this.demand_item_min_sellingprice,
      demand_item_purchasingprice: this.demand_item_purchasingprice,
      demand_item_tax: this.demand_item_tax,
      demand_item_from: this.loggedInWarehouse.value
    }).subscribe( data => {
      console.log(data);
      this.demandOrderData = data.json();
      this.changeDetector.detectChanges();
    });
  }
  approveTransfer(sentQuantity) {
    this._dataService.approveTransfer({
      transfer_item_type: "product",
      transfer_item_name: this.transferOrderApproveData.transfer_item_name,
      transfer_item_hsn_sac: this.transferOrderApproveData.transfer_item_hsn_sac,
      transfer_item_id : this.selectedTransferOrder,
      transfer_item_reqby: this.transferOrderApproveData.transfer_item_reqby,
      transfer_item_reqquantity: this.transferOrderApproveData.transfer_item_reqquantity,
      transfer_item_rate: this.transferOrderApproveData.transfer_item_rate,
      transfer_item_min_sellingprice: this.transferOrderApproveData.transfer_item_min_sellingprice,
      transfer_item_purchasingprice: this.transferOrderApproveData.transfer_item_purchasingprice,
      transfer_item_tax: this.transferOrderApproveData.transfer_item_tax,
      transfer_item_sent: sentQuantity,
      transfer_item_from: this.loggedInWarehouse.value,
    }).subscribe( data => {
      console.log(data.json());
      this.transferOrderData = data.json();
      this.changeDetector.detectChanges();
    });
  }
  confirmDemand(event) {
    this.demandOrderConfirmData = this.demandOrderData[event.target.id];
    console.log(this.demandOrderConfirmData);
    for (let i = 0; i < this.itemData.length; i++) {
      if (this.itemData[i].item_hsn_sac == this.demandOrderConfirmData.demand_item_hsn_sac) {
        this.confirm_demand_item_rate = this.itemData[i].item_sellingprice;
        this.confirm_demand_item_min_sellingprice = this.itemData[i].item_min_sellingprice;
        this.confirm_demand_item_purchasingprice = this.itemData[i].item_purchasingprice;
        this.confirm_demand_item_tax = this.itemData[i].item_tax;
        break;
      }
    }
    this._dataService.confirmDemand({
      confirm_demand_item_id: this.demandOrderConfirmData.demand_id,
      confirm_demand_item_type: "product",
      confirm_demand_item_name: this.demandOrderConfirmData.demand_item_name,
      confirm_demand_item_hsn_sac: this.demandOrderConfirmData.demand_item_hsn_sac,
      confirm_demand_item_from: this.loggedInWarehouse.value,
      confirm_demand_item_reqfrom: this.demandOrderConfirmData.demand_item_reqfrom,
      confirm_demand_item_quantity: this.demandOrderData[event.target.id].demand_item_received,
      confirm_demand_item_rate: this.confirm_demand_item_rate,
      confirm_demand_item_min_sellingprice: this.confirm_demand_item_min_sellingprice,
      confirm_demand_item_purchasingprice: this.confirm_demand_item_purchasingprice,
      confirm_demand_item_tax: this.confirm_demand_item_tax,
    }).subscribe( data => {
      console.log(data.json());
      this.demandOrderData = data.json();
      this.demandOrderConfirmData = data.json();
      this.changeDetector.detectChanges();
    });
  }
}
