import {Component, OnInit, ElementRef,Renderer2} from '@angular/core';
import {SaleService} from '../services/sale.service';
import {RoundPipe} from '../pipes/round.pipe';
import * as moment from "moment";
import {Http, Headers} from "@angular/http";
import {ifTrue} from "codelyzer/util/function";
import {HotkeysService, Hotkey} from "angular2-hotkeys";
import {DataService} from "../services/data.service";

declare var $:any;
declare var Materialize: any;
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  newInvoice:any;
  current_time = moment().format();
  items:any[]=[];
  list_id =2;
  displayRow:boolean=true;
  shipping_charge=0;
  adjustments=0;
  adjustmentName="Adjustments";
  subTotal=0;
  invoiceNumber="INV0001";
  netTotal=this.subTotal+this.shipping_charge+this.adjustments;
  discount_adjuster=0.01;
  id:any;
  salesperson="";
  additional_salesperson="";
  customer_name="";
  customer_contact:any;
  data:any={};
  key1:any;
  selectedItemName:any;
  selectedItem:any;
  purchasedItems:any[]=[];
  toPush = {
  "current_time":null,
  "item_invoice_number":null,
  "item_salesperson":null,
  "item_additional_salesperson":null,
  "item_name" : null,
  "item_type" : null,
  "item_hsn_sac" : null,
  "item_quantity":null,
  "item_rate": null,
  "item_discount":null,
  "item_discount_type":"%",
  "item_min_sellingprice":null,
    "item_quantity_available":null,
  "item_purchasingprice":null,
  "item_tax": null,
  "item_tax_type": false,
  "item_amount": null
  };
  saved:boolean=false;
  discount_type_options=[{title:"%",value:"%"},
                {title:"Rs.",value:"Rs."}];

  salesperson_list: any[] = [];

  additional_salesperson_list: any[] = [];

  selected_warehouse = JSON.parse(localStorage.getItem('auth_user_warehouse'));

  transaction_completed: boolean = false;
  toastOnce: number = 0;

  constructor(private _dataService:DataService,private _saleservice:SaleService,private elRef:ElementRef,private renderer : Renderer2,private http:Http,private _hotkeysService: HotkeysService) {
    // print hot key
    this._hotkeysService.add(new Hotkey('ctrl+p', (event: KeyboardEvent): boolean => {
      // console.log('Typed hotkey');
      this.printInvoice();
      return false; // Prevent bubbling
    }));



  }

  ngOnInit() {
    $("#details").focus();
    $(document).ready(function(){
      $('.tooltipped').tooltip({delay: 50});
    });
    this._saleservice.getInvoiceNumber();
    this._dataService.loggedInWarehouse$.subscribe((data) =>
    {
      this.selected_warehouse = data;
    });

    this._dataService.marketingPerson$.subscribe((data)=>
    {
      var temp = data.json();
      for(let i = 0;i < temp.length; i++)
      {
        this.salesperson_list.push({title: temp[i].user_name, value: temp[i].user_name});
      }

    });
    this._dataService.officePerson$.subscribe((data)=>
    {
      var temp = data.json();
      for(let i = 0;i < temp.length; i++)
      {
        this.salesperson_list.push({title: temp[i].user_name, value: temp[i].user_name});
      }

    });
    this._dataService.warehouseManager$.subscribe((data)=>
    {
      var temp = data.json();
      for(let i = 0;i < temp.length; i++)
      {
        this.salesperson_list.push({title: temp[i].user_name, value: temp[i].user_name});
      }

    });



    //this.purchasedItems[0]=this.toPush;

    // $("#discount_type_selector").on('change',function () {
    //   var selectedValue= $(this)[0].value;
    //   console.log(selectedValue,"klklk");
    // })
    // $("#selectPerson").on('change', function() {
    //   this.selectValue=$(this)[0].value;
    //   console.log(this.selectValue);
    // });

    // console.log(this.selected_warehouse);
    // const headers = new Headers();
    // let invoice_warehouse = {warehouse: this.selected_warehouse.value};
    // const body = JSON.stringify(invoice_warehouse);
    // this.http.post('http://localhost/api/get_invoice_number.php', body, {headers:headers}).subscribe(
    // (data)=> {
    //   console.log(data);
    //   var inv = data.json()[0].item_invoice_number;
    //   console.log(inv.slice(3, inv.length));
    //   console.log(inv,"inv");
    //   this.newInvoice = parseInt(inv.slice(3, inv.length)) + 1;
    //   var temp = "" + this.newInvoice;
    //   if (temp.length == 1) {
    //     this.newInvoice = "INV000" + this.newInvoice;
    //   }
    //   else if (temp.length == 2) {
    //     this.newInvoice = "INV00" + this.newInvoice;
    //   }
    //   else if (temp.length == 3) {
    //     this.newInvoice = "INV0" + this.newInvoice;
    //   }
    //   else {
    //     this.newInvoice = "INV" + this.newInvoice;
    //   }
    //   console.log(this.newInvoice,"1");
    //
    //
    // });
      //()=>{this.newInvoice=this.newInvoice[0].item_invoice_number}

    this._saleservice.invoiceNumber$.subscribe((data)=>{

      this.newInvoice = "INV-"+data+"";
      // console.log(data,"jkcomp");
    });

    //---------------------Receive all item info-------------------------//
    this._dataService.getItems();
      this._dataService.itemsSubject$.subscribe(
        (data)=>{ this.items = data;console.log(this.items,"io");

          // console.log(this.items.length);
          // for(let i = 0; i < this.items.length; i++)
          // {
          //   // this.data.push({
          //   //   [this.items[i].item_name] : null
          //   // })
          //    let key = this.items[i].item_name;
          //   this.data[key] = key;
          //
          // }
          // this.data = JSON.stringify(this.data);
          // // console.log(this.items,"items1");
          // // console.log(this.data);
        });


    //-------------------------------------------------------------------//






    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    // $(document).ready(function () {
    //   $('input.autocomplete').autocomplete({
    //     data: [this.data],
    //     limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
    //     minLength: 1,
    //     selectFirst: true,// The minimum length of the input for the autocomplete to start. Default: 1.
    //   });
    //     $('.tooltipped').tooltip({delay: 50});
    //
    //
    //
    //
    //
    // });







  }



  chooseAdditionalSalesperson(){
    // $('.additional_salesperson__choose').removeAttr("disabled");
    this.additional_salesperson_list = [];
    for(let i =0;i<this.salesperson_list.length;i++){
      if(this.salesperson != this.salesperson_list[i].value){
        this.additional_salesperson_list.push(this.salesperson_list[i]);
      }
    }
  }

  createRow() {
    if(this.saved==false) {

      if (this.displayRow == false) {
        this.displayRow = true;
      } else {
      // var id = "#item_list_"+(parseInt(this.id,10)+1);
      // console.log("id",id);
      // $(id).css("display","block");
      if (this.toPush.item_quantity > this.toPush.item_quantity_available) {
        this.toPush.item_quantity = this.toPush.item_quantity_available;
      }
      if (this.toPush.item_tax_type == true) {
        if (this.toPush.item_discount_type == "%") {
          this.toPush.item_amount = (this.toPush.item_quantity * parseInt(this.selectedItem.item_sellingprice, 10) * (100 - this.toPush.item_discount) * this.discount_adjuster) * (1 + this.discount_adjuster * this.toPush.item_tax);

        } else {
          this.toPush.item_amount = ((this.toPush.item_quantity * parseInt(this.selectedItem.item_sellingprice, 10)) - this.toPush.item_discount) * (1 + this.discount_adjuster * this.toPush.item_tax);
        }
      } else {
        if (this.toPush.item_discount_type == "%") {
          this.toPush.item_amount = (this.toPush.item_quantity * parseInt(this.selectedItem.item_sellingprice, 10) * (100 - this.toPush.item_discount) * this.discount_adjuster);

        } else {
          this.toPush.item_amount = ((this.toPush.item_quantity * parseInt(this.selectedItem.item_sellingprice, 10)) - this.toPush.item_discount);

        }
      }
      this.subTotal = this.subTotal + this.toPush.item_amount;
      this.purchasedItems.push(this.toPush);

      //console.log(this.items[i].item_sellingprice);
      // console.log(this.purchasedItems);
      this.toPush = {
        "current_time": null,
        "item_invoice_number": null,
        "item_salesperson": null,
        "item_additional_salesperson": null,
        "item_name": null,
        "item_type": null,
        "item_hsn_sac": null,
        "item_quantity": null,
        "item_rate": null,
        "item_discount": null,
        "item_discount_type": "%",
        "item_min_sellingprice": null,
        "item_quantity_available": null,
        "item_purchasingprice": null,
        "item_tax": null,
        "item_tax_type": false,
        "item_amount": null
      };

      $('.tooltipped').tooltip({delay: 50});


      this.list_id++;


      // $(document).ready(function () {
      //   $('input.autocomplete').autocomplete({
      //     data: {
      //     },
      //     limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
      //     minLength: 1,
      //     selectFirst: true,// The minimum length of the input for the autocomplete to start. Default: 1.
      //   });
      // });
      $('#details').focus();
    }
    }else{
      //this.displayRow=true;
      this.saved=false;
    }

  }

  deleteRow(event)
  {
    // console.log("id",event.target.id);
    var id= event.target.id;
    if(id=="item_list_to_push"){
        this.toPush={
          "current_time":null,
          "item_invoice_number":null,
          "item_salesperson":null,
          "item_additional_salesperson":null,
          "item_name" : null,
          "item_type" : null,
          "item_hsn_sac" : null,
          "item_quantity":null,
          "item_rate": null,
          "item_discount":null,
          "item_discount_type":"%",
          "item_min_sellingprice":null,
          "item_quantity_available":null,
          "item_purchasingprice":null,
          "item_tax": null,
          "item_tax_type": false,
          "item_amount": null
        };
        this.displayRow=false;
    }else {
      if (this.purchasedItems.length == 1) {
        this.subTotal = this.subTotal - this.purchasedItems[0].item_amount;
        this.purchasedItems = [];
      } else {
        this.subTotal = this.subTotal - this.purchasedItems[id].item_amount;
        for (var i = 0; i < this.purchasedItems.length - 1 - id; i++) {
          this.purchasedItems[i] = this.purchasedItems[i + 1];
        }

        this.purchasedItems.splice(this.purchasedItems.length - 1, 1);
      }
    }

  }


  fetchItemDetails(event) {


    if (this.saved == true) {
      this.displayRow = true;
    } else {
      // this.id = event.target.id;
      // console.log(this.id);
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].item_name == this.toPush.item_name) {

          this.selectedItem = this.items[i];
          this.toPush.current_time = this.current_time;
          this.toPush.item_invoice_number = this.newInvoice;
          this.toPush.item_salesperson = this.salesperson;
          this.toPush.item_additional_salesperson = this.additional_salesperson;
          this.toPush.item_name = this.selectedItem.item_name;
          this.toPush.item_type = this.selectedItem.item_type;
          this.toPush.item_hsn_sac = this.selectedItem.item_hsn_sac;
          this.toPush.item_rate = parseInt(this.selectedItem.item_sellingprice, 10);
          this.toPush.item_quantity = 1;
          this.toPush.item_tax = parseInt(this.selectedItem.item_tax.slice(0, 2), 10);
          this.toPush.item_min_sellingprice = this.selectedItem.item_min_sellingprice;
          var a = this.selected_warehouse.value;
          // console.log(a,"a");
          this.toPush.item_quantity_available = this.selectedItem[''+a+''];
          this.toPush.item_purchasingprice = this.selectedItem.item_purchasingprice;
          this.toPush.item_discount = 0;
          this.toPush.item_discount_type = "%";
          $("#info-tooltip").attr('data-tooltip','Minimum Selling Price: '+this.toPush.item_min_sellingprice+'');
          // this.toPush.item_discount_type=$("#"+event.target.id+"").value();
          if (this.toPush.item_discount_type == "%") {
            this.toPush.item_amount = (this.toPush.item_quantity * parseInt(this.selectedItem.item_sellingprice, 10) * (100 - this.toPush.item_discount) * this.discount_adjuster);
          } else {
            this.toPush.item_amount = ((this.toPush.item_quantity * parseInt(this.selectedItem.item_sellingprice, 10) ) - this.toPush.item_discount);
          }
          //this.subTotal=this.subTotal+this.toPush.item_amount;
          //$("#item_"+this.list_id+"_rate").val(this.items[i].item_sellingprice);
          //this.purchasedItems[id-1]=this.toPush;
          //     "item_name" : this.selectedItem.item_name,
          //     "item_quantity":1,
          //     "item_rate": this.selectedItem.item_sellingprice,
          //     "item_discount":0,
          //     "item_tax": this.selectedItem.item_tax,
          //     "item_amount": this.selectedItem.item_sellingprice


        }
      }

      console.log(this.toPush,"topush");

      if(this.toPush.item_quantity_available == 0 && this.toPush.item_type == 'product'){
        if(this.toastOnce == 0) {
          this.toastOnce++;
          Materialize.toast('Item not available in Inventory ! Please Select another Item', 2000);
        }
        $("#add-product-btn").attr("disabled","disabled");
        $("#save-bill-btn").attr("disabled","disabled");
        $("#print-invoice-btn").attr("disabled","disabled");
        $("#new-invoice-btn").attr("disabled","disabled");

      }else{
        $("#add-product-btn").removeAttr("disabled");
        $("#save-bill-btn").removeAttr("disabled");
        $("#print-invoice-btn").removeAttr("disabled");
        $("#new-invoice-btn").removeAttr("disabled");
        this.toastOnce = 0;
      }

    }
    // console.log(this.toPush);
  }

  endBill() {
    if(this.toPush.item_quantity>this.toPush.item_quantity_available){
      this.toPush.item_quantity = this.toPush.item_quantity_available;
    }
    if (this.toPush.item_name == null && this.toPush.item_rate == null) {
      // console.log("nothing doing");
    } else {
      if(this.toPush.item_tax_type==true) {
        if (this.toPush.item_discount_type == "%"){
          this.toPush.item_amount = (this.toPush.item_quantity * parseInt(this.selectedItem.item_sellingprice, 10) * (100 - this.toPush.item_discount) * this.discount_adjuster) * (1 + this.discount_adjuster * this.toPush.item_tax);
        }else{
          this.toPush.item_amount = ((this.toPush.item_quantity * parseInt(this.selectedItem.item_sellingprice, 10) - this.toPush.item_discount)) * (1 + this.discount_adjuster * this.toPush.item_tax);
          }
      }else{
        if(this.toPush.item_discount_type=="%") {
          this.toPush.item_amount = (this.toPush.item_quantity * parseInt(this.selectedItem.item_sellingprice, 10) * (100 - this.toPush.item_discount) * this.discount_adjuster);
        }else{
          this.toPush.item_amount = ((this.toPush.item_quantity * parseInt(this.selectedItem.item_sellingprice, 10) ) - this.toPush.item_discount);
        }
        }
      this.subTotal=this.subTotal+this.toPush.item_amount;
      this.purchasedItems.push(this.toPush);
        this.toPush = {
          "current_time":null,
          "item_invoice_number":null,
          "item_salesperson":null,
          "item_additional_salesperson":null,
          "item_name" : null,
          "item_type" : null,
          "item_hsn_sac" : null,
          "item_quantity":null,
          "item_rate": null,
          "item_discount":null,
          "item_discount_type":"%",
          "item_min_sellingprice":null,
          "item_quantity_available":null,
          "item_purchasingprice":null,
          "item_tax": null,
          "item_tax_type": false,
          "item_amount": null}
      };

      this.displayRow=false;
      this.saved=true;
    }


    chgProduct(event){
      var id = event.target.id.slice(5,6);
      var input_type = event.target.id.slice(7,8);
    // console.log(event.target.value);
      for(var i=0;i<this.items.length;i++)
      {
        if(this.items[i].item_name==this.purchasedItems[id].item_name)
        {
          var newItem = this.items[i];
          console.log(newItem);
          this.purchasedItems[id].item_name = newItem.item_name;
          this.purchasedItems[id].item_type = newItem.item_type;
          this.purchasedItems[id].item_hsn_sac = newItem.item_hsn_sac;
          this.purchasedItems[id].item_rate = parseInt(newItem.item_sellingprice,10);
          this.purchasedItems[id].item_quantity = 1;
          this.purchasedItems[id].item_tax = parseInt(newItem.item_tax.slice(0,2),10);
          this.purchasedItems[id].item_min_sellingprice= parseInt(newItem.item_min_sellingprice);
          this.purchasedItems[id].item_discount = 0;
          this.purchasedItems[id].item_discount_type = "%";
          // this.toPush.item_discount_type=$("#select"+i)
          this.subTotal=this.subTotal-this.purchasedItems[id].item_amount;
          if(this.purchasedItems[id].item_tax_type==true) {
            if(this.purchasedItems[id].item_discount_type=="%") {
              this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * parseInt(newItem.item_sellingprice, 10) * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster) * (1 + this.discount_adjuster * parseInt(newItem.item_tax, 10));
            }else{
              this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * parseInt(newItem.item_sellingprice, 10))  - this.purchasedItems[id].item_discount) * (1 + this.discount_adjuster * parseInt(newItem.item_tax, 10));
            }
            }else {
            if (this.purchasedItems[id].item_discount_type == "%") {
              this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * parseInt(newItem.item_sellingprice, 10) * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster);
            } else {
              this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * parseInt(newItem.item_sellingprice, 10)) - this.purchasedItems[id].item_discount);
            }
              this.subTotal = this.subTotal + this.purchasedItems[id].item_amount;
            }


        }
      }

    }


    reAdjustQuantity(event){
      var id = event.target.id.slice(5,6);
      var input_type = event.target.id.slice(7,8);
      if(input_type="q") {
        this.purchasedItems[id].item_quantity = event.target.value;
      }
      if(this.purchasedItems[id].item_quantity>this.purchasedItems[id].item_quantity_available){
        this.purchasedItems[id].item_quantity = this.purchasedItems[id].item_quantity_available
      }
      this.subTotal=this.subTotal-this.purchasedItems[id].item_amount;
      if(this.purchasedItems[id].item_tax_type==true){
        if(this.purchasedItems[id].item_discount_type=="%") {
          this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
        }else{
          this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate) - this.purchasedItems[id].item_discount) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
        }
      }else{
        if(this.purchasedItems[id].item_discount_type=="%"){
          this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity*this.purchasedItems[id].item_rate*(100-this.purchasedItems[id].item_discount)*this.discount_adjuster);
        }else{
          this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity*this.purchasedItems[id].item_rate)-this.purchasedItems[id].item_discount);
        }

      }
      this.subTotal=this.subTotal+this.purchasedItems[id].item_amount;
    }

  reAdjustDiscount(event){
    var id = event.target.id.slice(5,6);
    var input_type = event.target.id.slice(7,8);
    if(input_type=="d") {
      this.purchasedItems[id].item_discount = event.target.value;
    }
    this.subTotal=this.subTotal-this.purchasedItems[id].item_amount;
    if(this.purchasedItems[id].item_tax_type==true){
      if(this.purchasedItems[id].item_discount_type=="%") {
        this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
      }else{
        this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate) - this.purchasedItems[id].item_discount) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
      }
      }else {
      if (this.purchasedItems[id].item_discount_type == "%") {
        this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster);
      }else{
        this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate)- this.purchasedItems[id].item_discount);
      }

    }
    this.subTotal=this.subTotal+this.purchasedItems[id].item_amount;
    }


  reAdjustDiscountType(event){
    var id = event.target.id.slice(5,6);
    var input_type = event.target.id.slice(7,8);
    if(input_type=="s") {
      this.purchasedItems[id].item_discount_type = event.target.value;
    }
    this.subTotal=this.subTotal-this.purchasedItems[id].item_amount;
    if(this.purchasedItems[id].item_tax_type==true){
      if(this.purchasedItems[id].item_discount_type=="%") {
        this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
      }else{
        this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate) - this.purchasedItems[id].item_discount) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
      }
    }else {
      if (this.purchasedItems[id].item_discount_type == "%") {
        this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster);
      }else{
        this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate)- this.purchasedItems[id].item_discount);
      }

    }
    this.subTotal=this.subTotal+this.purchasedItems[id].item_amount;

  }





    reAdjustRate(event){

      var id = event.target.id.slice(5,6);
      var input_type = event.target.id.slice(7,8);
      if(input_type="r") {
        this.purchasedItems[id].item_rate = event.target.value;
      }
      this.subTotal=this.subTotal-this.purchasedItems[id].item_amount;
      if(this.purchasedItems[id].item_tax_type==true){
        if(this.purchasedItems[id].item_discount_type=="%") {
          this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
        }else{
          this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate )- this.purchasedItems[id].item_discount) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
        }
      }
      else {
        if (this.purchasedItems[id].item_discount_type == "%") {
          this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster);
        }else{
          this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate) - this.purchasedItems[id].item_discount);
        }
      }
      this.subTotal=this.subTotal+this.purchasedItems[id].item_amount;

      // console.log(input_type);
      // console.log("Kuch toh hua",id);


    }


    reAdjustTaxType(event)
    {
      // console.log("type",event.target.id);
      var id = event.target.id.slice(5,6);
      this.subTotal=this.subTotal-this.purchasedItems[id].item_amount;
      if(this.purchasedItems[id].item_tax_type==true){
        if(this.purchasedItems[id].item_discount_type=="%") {
          this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
        }else {
          this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate ) - this.purchasedItems[id].item_discount) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
        }
        }else{
        if(this.purchasedItems[id].item_discount_type=="%") {
          this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster);
        }else{
          this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate)- this.purchasedItems[id].item_discount);
        }
        }
      this.subTotal=this.subTotal+this.purchasedItems[id].item_amount;
    }

  reAdjustTax(event) {
    // console.log("tax", event.target.value);
    var id = event.target.id.slice(5, 6);
    this.subTotal = this.subTotal - this.purchasedItems[id].item_amount;
    if (this.purchasedItems[id].item_tax_type == true) {
      if(this.purchasedItems[id].item_discount_type=="%") {
      this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
      }else{
        this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate) - this.purchasedItems[id].item_discount) * (1 + this.discount_adjuster * this.purchasedItems[id].item_tax);
      }
    } else {
        if(this.purchasedItems[id].item_discount_type=="%") {
          this.purchasedItems[id].item_amount = (this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate * (100 - this.purchasedItems[id].item_discount) * this.discount_adjuster);
      }else{
          this.purchasedItems[id].item_amount = ((this.purchasedItems[id].item_quantity * this.purchasedItems[id].item_rate ) - this.purchasedItems[id].item_discount);
        }

      }
      this.subTotal = this.subTotal + this.purchasedItems[id].item_amount;
    }


  printInvoice() {
    if(this.saved==false) {
      this.endBill();
    }
    this.completeTransaction();

    $("#invoiceToPrint").css("display","block");

    setTimeout(function () {
      var divToPrint=document.getElementById("invoiceToPrint");
      let newWin= window.open("");
      newWin.document.write(divToPrint.outerHTML);
      newWin.print();
      newWin.close();
      $("#invoiceToPrint").css("display","none");

    },300);

  }

completeTransaction(){

  for(let i=0;i<this.purchasedItems.length;i++){
    this.purchasedItems[i]["item_invoice_amount"] = this.subTotal;
    this.purchasedItems[i]["item_customer_name"] = this.customer_name;
    this.purchasedItems[i]["item_customer_contact"] = this.customer_contact;
    this.purchasedItems[i]["item_invoice_shippingcharge"] = this.shipping_charge;
    this.purchasedItems[i]["item_invoice_adjustments"] = this.adjustments;
    this.purchasedItems[i]["item_invoice_adjustments_name"] = this.adjustmentName;
  }

   this.purchasedItems.push({ "source_warehouse" : this.selected_warehouse.value });


   this._saleservice.completeTransaction(this.purchasedItems)
    .subscribe(
    data => {
      console.log(data);
      this.transaction_completed = true;
      this.purchasedItems.splice(this.purchasedItems.length-1,1);
      // console.log("final",this.purchasedItems);
    });

   //-------------------------Update Item Table ----------------------------------//



   //--------------------------------------------------------------------------------//



}

makeNewInvoice(){
  if(this.transaction_completed == true){this._saleservice.updateInvoiceNumber({"invoice_number" : parseInt(this.newInvoice.slice(4,this.newInvoice.length),10)});}
  this._dataService.getItems();
  this._dataService.itemsSubject$.subscribe((res)=>{ this.items = res; });
  this.purchasedItems=[];
  this.customer_contact=null;
  this.customer_name="";
  this.salesperson = null;
  this.additional_salesperson = null;
  // console.log("print",this.purchasedItems);
  this.displayRow=true;
  // var inv = this.newInvoice;
  // console.log(inv.slice(3, inv.length));
  // console.log(inv,"inv");
  // this.newInvoice = parseInt(inv.slice(3, inv.length)) + 1;
  // var temp = "" + this.newInvoice;
  // if (temp.length == 1) {
  //   this.newInvoice = "INV000" + this.newInvoice;
  // }
  // else if (temp.length == 2) {
  //   this.newInvoice = "INV00" + this.newInvoice;
  // }
  // else if (temp.length == 3) {
  //   this.newInvoice = "INV0" + this.newInvoice;
  // }
  // else {
  //   this.newInvoice = "INV" + this.newInvoice;
  // }
  // console.log(this.newInvoice,"1");
  this.netTotal=0;
  this.subTotal=0;
  this.shipping_charge=0;
  this.adjustments=0;
  this.adjustmentName="Adjustments";
  this.saved=false;
  this.displayRow=true;
  this.toPush = {
    "current_time":null,
    "item_invoice_number":null,
    "item_salesperson":null,
    "item_additional_salesperson":null,
    "item_name" : null,
    "item_type" : null,
    "item_hsn_sac" : null,
    "item_quantity":null,
    "item_rate": null,
    "item_discount":null,
    "item_discount_type":"%",
    "item_min_sellingprice":null,
    "item_quantity_available":null,
    "item_purchasingprice":null,
    "item_tax": null,
    "item_tax_type": false,
    "item_amount": null
  };

this.transaction_completed = false;
}

}


//////#Himansh_0114cs0810412///////////////

//
// <li id="list_item_'+this.list_id+'"><div class="row"><div class="col l3"><div class="input-field"><input id="item_'+this.list_id+'_name" [(ngModel)]="selectedItemName" (keydown)="this.fetchItemDetails($event)" type="text" list="languages" class="autocomplete item-detail" autofocus="autofocus"><datalist  id="languages"> <option *ngFor="let item of items" [value]="item.item_name"> </datalist></div></div> <div class="col l1"> <div class="input-field"><input type="number" value="1" min="0"></div></div> <div class="col l2"> <div class="input-field"> <input type="number" min="0"> </div> </div> <div class="col l1"> <div class="input-field"> <input type="number" min="0"> </div> </div> <div class="col l1"> <div class="input-field"> <select> <option value="1">%</option> <option value="2">Rs.</option> </select> </div> </div> <div class="col l1"> <div class="input-field"> <input type="number" min="0"> </div> </div> <div class="col l2"> <div class="input-field"><input type="number" min="0"></div></div><div><span id="list_item_'+this.list_id+'" role="button" (click)="deleteRow()" (keypress)="deleteRow()"><i tabindex="0" style="margin: 2%;color: red" class="material-icons adjust_remove_circle">remove_circle</i></span> </div> </div> </li>
