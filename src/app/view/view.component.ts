import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
declare var $: any;
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  whData: any;
  p1: number = 1;
  p2: number = 1;
  p3: number = 1;
  p4: number = 1;
  p5: number = 1;
  whmanagerData: any;
  marketingPersonData: any;
  officePersonData: any;
  customerData: any;
  selectValue: any;
  whTemplate = ['Id', 'Warehouse Name', 'Email', 'Address', 'Contact'];
  whmanagerTemplate = ['Name', 'Email', 'Address', 'Contact'];
  marketingPersonTemplate = ['Name', 'Email', 'Warehouse', 'Address', 'City', 'State', 'Zipcode', 'Country', 'Contact'];
  officePersonTemplate = ['Name', 'Email', 'Warehouse', 'Address', 'City', 'State', 'Zipcode', 'Country', 'Contact'];
  customerTemplate = ['Name', 'Email', 'Address', 'City', 'State', 'Zipcode', 'Country', 'Contact'];
  constructor(public _dataService: DataService) {
  }
  ngOnInit() {
    $('.marketingPersonTable').css('display' , 'none');
    $('.officePersonTable').css('display' , 'none');
    $('.customerTable').css('display' , 'none');
    $('.whmanagerTable').css('display' , 'none');
    $('.whTable').css('display' , 'none');

    this._dataService.getWhmanager();
    this._dataService.getMarketingPerson();
    this._dataService.getOfficePerson();

    this._dataService.warehouseManager$.subscribe(
      (data) => {
        this.whmanagerData = data.json();
        console.log(this.whmanagerData, "managerData");
        // this._dataService.preloaderShow.next(false);
      });


    this._dataService.marketingPerson$.subscribe(
      (data) => {
        this.marketingPersonData = data.json();
        console.log(this.marketingPersonData, 'market');
        // this._dataService.preloaderShow.next(false);
      });


    this._dataService.officePerson$.subscribe(
      (data) => {
        this.officePersonData = data.json();
        console.log(this.officePersonData, 'officeprsn');
        // this._dataService.preloaderShow.next(false);
      });


    this._dataService.getWarehouse().subscribe(
      (data) => {
        this.whData = data.json();
        console.log(this.whData);
      });


    this._dataService.getCustomer().subscribe(
      (data) => {
        this.customerData = data.json();
        console.log(this.customerData,"cust");
      });


  }
  roleSelect() {
    $('#filter_role').on('change', function () {
      this.selectValue = $(this)[0].value;
      console.log(this.selectValue);
      if (this.selectValue == 'whmanager') {
        $('.marketingPersonTable').css('display', 'none');
        $('.officePersonTable').css('display', 'none');
        $('.customerTable').css('display', 'none');
        $('.whTable').css('display', 'none');
        $('.whmanagerTable').css('display', 'block');
        // this._dataService.getWhmanager();
        // this._dataService.preloaderShow.next(true);
        // this._dataService.warehouseManager$.subscribe(
        //   (data) => {
        //     this.whmanagerData = data.json();
        //     console.log(this.whmanagerData, "managerData");
        //     this._dataService.preloaderShow.next(false);
        //   });
      }
      else if (this.selectValue == 'marketingperson') {
        $('.whmanagerTable').css('display', 'none');
        $('.officePersonTable').css('display', 'none');
        $('.customerTable').css('display', 'none');
        $('.whTable').css('display', 'none');
        $('.marketingPersonTable').css('display', 'block');
      }
      else if (this.selectValue == 'officeperson') {
        $('.whmanagerTable').css('display', 'none');
        $('.marketingPersonTable').css('display', 'none');
        $('.customerTable').css('display', 'none');
        $('.whTable').css('display', 'none');
        $('.officePersonTable').css('display', 'block');
      }
      else if (this.selectValue == 'customer') {

        $('.whmanagerTable').css('display', 'none');
        $('.marketingPersonTable').css('display', 'none');
        $('.officePersonTable').css('display', 'none');
        $('.whTable').css('display', 'none');
        $('.customerTable').css('display', 'block');
      }
      else {
        $('.whmanagerTable').css('display', 'none');
        $('.marketingPersonTable').css('display', 'none');
        $('.officePersonTable').css('display', 'none');
        $('.customerTable').css('display', 'none');
        $('.whTable').css('display', 'block');
      }
    });
  }
}
