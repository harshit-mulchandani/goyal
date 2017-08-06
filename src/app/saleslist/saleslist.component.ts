import {Component, EventEmitter, OnInit, ChangeDetectorRef, Inject, AfterViewInit, ViewChild} from '@angular/core';
import {DataService} from '../services/data.service';
import {MaterializeAction} from "angular2-materialize";
declare var $: any;
declare var Materialize: any;
import * as jsPDF from 'jspdf';
import * as html2canvas from "html2canvas";
import {parseLine} from "tslint/lib/test/lines";
import {Headers, Http} from "@angular/http";
@Component({
  selector: 'app-saleslist',
  templateUrl: './saleslist.component.html',
  styleUrls: ['./saleslist.component.css']
})
export class SaleslistComponent implements OnInit,AfterViewInit {
  p = 1;
  modalActions = new EventEmitter<string|MaterializeAction>();
  public invoice_list_final: any[] = [];
  loggedInWarehouse = JSON.parse(localStorage.getItem('auth_user_warehouse')).value;
  invoiceData: any;
  editInvoice:any=[];
  adjustmentName:any;
  bcc = false;
  adjustmentValue:any;
  customerName:any;
  customerContact:any;
  selectedInvoiceDate:any;
  invoice_shippingcharge:any;
  invoice_amount:any;
  invoice_list = {
    'invoice_date' : null,
    'invoice_number' : null,
    'invoice_customer_name' : null,
    'invoice_shippingcharge' : 0,
    'invoice_adjustments' : 0,
    'invoice_amount' : 0,
    'invoice_edited' : 0,

  };
  emailFrom = "";
  emailTo = "";
  emailCc = "";
  salesListTemplate = ['', 'Date', 'Invoice', 'Customer Name', 'Amount'];
  invoiceOptions = false;
  selectedInvoice: any="";
  constructor(public _dataService: DataService,private changeDetector:ChangeDetectorRef,private http:Http, @Inject('Window') private window: Window) { }
  ngOnInit() {
    $(document).ready(function(){
      $('select').material_select();
    });
    $('.editable').each(function(){
      this.contentEditable = true;
    });
    this._dataService.loggedInWarehouse$.subscribe((data) =>
    {
      this.loggedInWarehouse = data.value;
      this._dataService.preloaderShow.next(true);
      this._dataService.getInvoiceList({warehouse: this.loggedInWarehouse}).subscribe(
        (data) => {
          this.invoiceData = data.json();
          console.log("lol",this.invoiceData);
          if(this.invoiceData[0]!=null){
            this.invoice_list_final = this.generate_invoice_list_final(this.invoiceData);
            this.refreshList();
          }else{
            this.invoice_list_final = [];
          }

          this._dataService.preloaderShow.next(false);
        });


    });
    console.log(this.loggedInWarehouse);
    this._dataService.getInvoiceList({warehouse: this.loggedInWarehouse}).subscribe(
      (data) => {
        this.invoiceData = data.json();
        console.log("lol",this.invoiceData);
        this.invoice_list_final = this.generate_invoice_list_final(this.invoiceData);
        this.refreshList();
      });

    $(document).ready(function(){
      // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
      $('.modal').modal();
    });



  }

  addBcc(){
    this.bcc = true;
  }


  ngAfterViewInit(){
  }

  //---------------------------empty modal ----------------------------------------//

  emptyModal(){
    this.adjustmentName=null;
    this.adjustmentValue=null;
    this.editInvoice=null;
  }






  // ------------------------------------------------------------------------------ //

  generate_invoice_list_final(invoiceData) {
    let temp = 0;
    let firstIteration = true;
    let memory = parseInt((invoiceData[0].item_invoice_number).slice(3, 7), 10);
    for (let i = 0; i < invoiceData.length; i++) {
      if (invoiceData[i].item_invoice_number == null) {
        continue;
      }
      temp = parseInt((invoiceData[i].item_invoice_number).slice(3, 7), 10);
      if (firstIteration) {
        this.invoice_list.invoice_date = invoiceData[i].item_timestamp;
        this.invoice_list.invoice_number = invoiceData[i].item_invoice_number;
        this.invoice_list.invoice_customer_name = invoiceData[i].item_customer_name;
        this.invoice_list.invoice_shippingcharge = parseInt(invoiceData[i].item_invoice_shippingcharge, 10);
        this.invoice_list.invoice_adjustments = parseInt(invoiceData[i].item_invoice_adjustments, 10);
        this.invoice_list.invoice_amount =  parseInt(invoiceData[i].item_amount, 10);
        this.invoice_list.invoice_edited = invoiceData[i].item_invoice_edited;
        // memory = parseInt((this.invoiceData[i].item_invoice_number).slice(3, 7), 10);
        firstIteration = false;
        continue;
      }
      if (temp == memory) {
        this.invoice_list.invoice_amount = this.invoice_list.invoice_amount + parseInt(invoiceData[i].item_amount, 10);

      }
      else {
        this.invoice_list.invoice_amount = this.invoice_list.invoice_amount + this.invoice_list.invoice_shippingcharge + this.invoice_list.invoice_adjustments;
        this.invoice_list_final.push(this.invoice_list);
        this.invoice_list = {
          'invoice_date' : null,
          'invoice_number' : null,
          'invoice_customer_name' : null,
          'invoice_shippingcharge' : 0,
          'invoice_adjustments' : 0,
          'invoice_amount' : 0,
          'invoice_edited' : 0
        };
        this.invoice_list.invoice_date = invoiceData[i].item_timestamp;
        this.invoice_list.invoice_number = invoiceData[i].item_invoice_number;
        this.invoice_list.invoice_customer_name = invoiceData[i].item_customer_name;
        this.invoice_list.invoice_shippingcharge = parseInt(invoiceData[i].item_invoice_shippingcharge, 10);
        this.invoice_list.invoice_adjustments = parseInt(invoiceData[i].item_invoice_adjustments, 10);
        this.invoice_list.invoice_amount = this.invoice_list.invoice_amount + parseInt(invoiceData[i].item_amount, 10);
        this.invoice_list.invoice_edited = invoiceData[i].item_invoice_edited;
        memory = parseInt((invoiceData[i].item_invoice_number).slice(3, 7), 10);
      }
    }
    this.invoice_list.invoice_amount = this.invoice_list.invoice_amount + this.invoice_list.invoice_shippingcharge + this.invoice_list.invoice_adjustments;

    this.invoice_list_final.push(this.invoice_list);
    console.log(this.invoice_list_final, "invoice_list_final");
    return this.invoice_list_final;
  }



  // ------------------------------------------------------------------------------ //



  showInvoiceOptions(event) {
    this.invoiceOptions = true;
    this.selectedInvoice = event.target.id;
    for(let i=0;i<this.invoiceData.length;i++) {
      if (this.invoiceData[i].item_invoice_number==this.selectedInvoice) {
        this.customerContact = this.invoiceData[i].item_customer_contact;
        this.customerName = this.invoiceData[i].item_customer_name;
        this.selectedInvoiceDate = this.invoiceData[i].item_timestamp.slice(0,11);
      }
    }

    $(".saleslist-component__invoice-options").css("background-color","#ffff93");
    $(".saleslist-component__invoice-options").css("padding-top","2%");


    let editInvoice:any=[];
    for(var i=0;i<this.invoiceData.length;i++)
    {
      if(this.invoiceData[i].item_invoice_number == this.selectedInvoice){
        editInvoice.push(this.invoiceData[i]);
      }
    }
    this.editInvoice=editInvoice;
    this.adjustmentValue= parseInt(this.editInvoice[0].item_invoice_adjustments,10);
    this.adjustmentName= this.editInvoice[0].item_invoice_adjustments_name;
    this.invoice_amount= parseInt(this.editInvoice[0].item_invoice_amount,10);
    this.invoice_shippingcharge= parseInt(this.editInvoice[0].item_invoice_shippingcharge,10);
    console.log("edit",this.editInvoice,this.adjustmentValue);

  }
  deleteInvoiceItem() {
    //$(".progress").removeClass("hide");
    this._dataService.preloaderShow.next(true);
    this.invoice_list_final = [];
    this._dataService.deleteInvoiceItem({invoiceNumber: this.selectedInvoice, warehouse: this.loggedInWarehouse}).
    subscribe( data => {
      this.invoiceData = data.json();
      this.changeDetector.detectChanges();
      this.invoice_list_final = this.generate_invoice_list_final(this.invoiceData);
      console.log(this.invoice_list_final);
      // $(".progress").addClass("hide");
      this._dataService.preloaderShow.next(false);
    });
  }

  mailInvoiceItem() {
    //$(".progress").removeClass("hide");
    this._dataService.preloaderShow.next(true);
    let mail_array = [];
        mail_array[0] = this.selectedInvoiceDate;
        mail_array[1] = this.selectedInvoice;
        mail_array[2] = this.customerName;
        mail_array[3] = this.customerContact;
        mail_array[4] = this.invoice_amount;
        mail_array[5] = this.invoice_shippingcharge;
        mail_array[6] = this.adjustmentName;
        mail_array[7] = this.adjustmentValue;
        mail_array[8] = this.emailFrom;
        mail_array[9] = this.emailTo;
        mail_array[10] = this.emailCc;

    for(let i=0;i<this.editInvoice.length;i++)
    {
      mail_array[11+i] = this.editInvoice[i];
    }
    //$(".progress").addClass("hide");
    console.log(mail_array);
    this._dataService.sendmail(mail_array).subscribe((data) => {

      // console.log(data.text());
      if(data.text()=="Success")
      {
        Materialize.toast('Mail Sent!', 2000)
      }else{
        Materialize.toast('Could Not Send', 2000)
      }
      this._dataService.preloaderShow.next(false);
    });



  }


  openEditModal(){
    console.log(this.selectedInvoice);
    let editInvoice:any=[];
    for(var i=0;i<this.invoiceData.length;i++)
    {
      if(this.invoiceData[i].item_invoice_number == this.selectedInvoice){
        editInvoice.push(this.invoiceData[i]);
      }
    }
    this.editInvoice=editInvoice;
    this.adjustmentValue= parseInt(this.editInvoice[0].item_invoice_adjustments,10);
    this.adjustmentName= this.editInvoice[0].item_invoice_adjustments_name;
    this.invoice_amount= parseInt(this.editInvoice[0].item_invoice_amount,10);
    this.invoice_shippingcharge= parseInt(this.editInvoice[0].item_invoice_shippingcharge,10);
    console.log("edit",this.editInvoice,this.adjustmentValue);

  }

  editInvoiceItem() {
    let compactEditedInvoice: any = {};
    //$(".progress").removeClass("hide");
    this._dataService.preloaderShow.next(true);

    compactEditedInvoice["item_invoice_number"] = this.editInvoice[0].item_invoice_number;
    compactEditedInvoice["item_invoice_adjustments_name"] = this.adjustmentName;
    compactEditedInvoice["item_invoice_adjustments"] = this.adjustmentValue;
    compactEditedInvoice["item_invoice_warehouse"] = this.loggedInWarehouse;
    console.log(compactEditedInvoice, "comp");

    this._dataService.editInvoiceItem(compactEditedInvoice).subscribe((data)=>{
      console.log(data.json(),"data");
      this.invoiceData = data.json();
      this.invoice_list_final = [];
      this.invoice_list_final = this.generate_invoice_list_final(this.invoiceData);
      console.log(this.invoice_list_final);
      this.adjustmentName=null;
      this.adjustmentValue=null;
      $(".progress").addClass("hide");
      this.changeDetector.detectChanges();
      this._dataService.preloaderShow.next(false);
    });



  }


  print() {
    this._dataService.preloaderShow.next(true);

    $("#invoice").css("display","block");
    // let editInvoice:any=[];
    // for(var i=0;i<this.invoiceData.length;i++)
    // {
    //   if(this.invoiceData[i].item_invoice_number == this.selectedInvoice){
    //     editInvoice.push(this.invoiceData[i]);
    //   }
    // }
    // this.editInvoice=editInvoice;
    // this.adjustmentValue= parseInt(this.editInvoice[0].item_invoice_adjustments,10);
    // this.adjustmentName= this.editInvoice[0].item_invoice_adjustments_name;
    // this.invoice_amount= parseInt(this.editInvoice[0].item_invoice_amount,10);
    // this.invoice_shippingcharge= parseInt(this.editInvoice[0].item_invoice_shippingcharge,10);
    // console.log("edit",this.editInvoice,this.adjustmentValue);


    $('body').scrollTop(0);
    this.createPDF();

    // var pdf = new jsPDF('l', 'pt', 'a4');
    // var options = {
    //   pagesplit: true
    // };
    //
    // pdf.addHTML($('invoice'), 0, 0, options, function(){
    //   pdf.output('datauri');
    // });


//-----------------------------------------------------------------------------------------------------//
    var
      form = $("#invoice"),
      cache_width = form.width(),
      a4 = [595.28, 841.89]; // for a4 size paper width and height
    $("#invoice").css("display","none");


  }

  createPDF() {
    var pdf:any;
    this.getCanvas().then(function(canvas) {
      var
        img = canvas.toDataURL("image/png"),
        doc = new jsPDF({
          unit: 'px',
          format: 'a4'
        });
      doc.addImage(img, 'JPEG', 20, 20);
      //var selectedInvoice = parseLine(this.selectedInvoice);

      //pdf = btoa(doc.output());
      pdf = doc.output('datauristring');
      // $('iframe').attr('src', pdf);

      doc.save("Invoice");
      const body = pdf;
      const headers = new Headers();
      //console.log(body,"body");
      $("#invoice").width($("#invoice").width());

      // this.http.post('http://localhost/api/upload_invoice.php', body, {headers: headers}).subscribe((data)=>{
      //   console.log(data,"l");
      // });


    });

    this._dataService.preloaderShow.next(false);
  }

  refreshList(){
    this._dataService.preloaderShow.next(true);

    this.invoice_list_final = [];
    console.log(this.loggedInWarehouse,"data");
    this._dataService.getInvoiceList({warehouse: this.loggedInWarehouse}).subscribe(
      (data) => {

        this.invoiceData = data.json();
        if(this.invoiceData[0]!=null){
          console.log("lol",this.invoiceData);
          this.invoice_list_final = this.generate_invoice_list_final(this.invoiceData);
        }

        this._dataService.preloaderShow.next(false);
      });
  }




  getCanvas() {
    $("#invoice").width(([595.28, 841.89][0] * 1.33333) - 80).css('max-width', 'none');
    return html2canvas($("#invoice"), {});
  }


  closeOptions(){
    this.invoiceOptions = false;
    $(".saleslist-component__invoice-options").css("background-color","#ffffff");
    $(".saleslist-component__invoice-options").css("padding-top","0");
  }

}
