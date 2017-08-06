import {ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {MaterializeAction} from "angular2-materialize";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../services/data.service";
declare var $: any;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  modalActions = new EventEmitter<string|MaterializeAction>();
  editNameForm: FormGroup;
  editEmailForm: FormGroup;
  editPasswordForm: FormGroup;
  whForm: FormGroup;
  loggedInUser: any;
  adminName: any;
  adminEmail: any;
  constructor(public _dataService: DataService, private changeDetector: ChangeDetectorRef) {
    this.editNameForm = new FormGroup({
      'admin_name': new FormControl('', Validators.required)
    });
    this.editEmailForm = new FormGroup({
      'admin_email': new FormControl('', Validators.required)
    });
    this.editPasswordForm = new FormGroup({
      'admin_old_password': new FormControl('', Validators.required),
      'admin_new_password': new FormControl('', Validators.required),
      'admin_re_password': new FormControl('', Validators.required)
    });
    this.whForm = new FormGroup({
      'wh_warehouse_name': new FormControl('', Validators.required),
      'wh_email': new FormControl('', [Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
      'wh_address': new FormControl('', Validators.required),
      'wh_contact': new FormControl('', Validators.required)
    });
  }
  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('auth_user'));
    console.log(this.loggedInUser);
  }
  resetWh() {
    $('#wh_warehouse_name').val(null).removeClass('valid');
    $('#wh_email').val(null).removeClass('valid');
    $('#wh_address').val(null).removeClass('valid');
    $('#wh_contact').val(null).removeClass('valid');
  }
  // Open Modal
  openeditnamemodal() {
    this.adminName = this.loggedInUser[0].user_name;
    $('#settings-component__edit-name-modal').modal('open');
    $('#admin_name_label').addClass('active');
  }
  openeditemailmodal() {
    this.adminEmail = this.loggedInUser[0].user_email;
    $('#settings-component__edit-email-modal').modal('open');
    $('#admin_email_label').addClass('active');
  }
  openeditpasswordmodal() {
    $('#settings-component__edit-password-modal').modal('open');
  }
  openwhmodal() {
    $('#settings-component__wh-modal').modal('open');
  }
  // Close Modal
  closeeditnamemodal() {
    $('#settings-component__edit-name-modal').modal('close');
  }
  closeeditemailmodal() {
    $('#settings-component__edit-email-modal').modal('close');
  }
  closeeditpasswordmodal() {
    $('#settings-component__edit-password-modal').modal('close');
  }
  closewhmodal() {
    $('#settings-component__wh-modal').modal('close');
    this.resetWh();
  }
  whFormSubmit() {
    console.log(this.whForm.value);
    this._dataService.createWh({
      wh_warehouse_name: this.whForm.value.wh_warehouse_name,
      wh_email: this.whForm.value.wh_email,
      wh_address: this.whForm.value.wh_address,
      wh_contact: this.whForm.value.wh_contact
    }).subscribe( data => {
      console.log(data.json());
    });
    this.resetWh();
    this.whForm.reset();
  }
  editNameFormSubmit() {
    console.log(this.editNameForm.value);
    this._dataService.editAdminName({
      admin_name : this.editNameForm.value.admin_name,
      admin_email : '',
      admin_password : ''
    }).subscribe( data => {
      localStorage.setItem('auth_user', JSON.stringify(data.json()));
      this.loggedInUser = JSON.parse(localStorage.getItem('auth_user'));
      this.changeDetector.detectChanges();
      console.log(JSON.parse(localStorage.getItem('auth_user')));
    });
    this.editNameForm.reset();
  }
  editEmailFormSubmit() {
    console.log(this.editEmailForm.value);
    this._dataService.editAdminEmail({
      admin_name : '',
      admin_email : this.editEmailForm.value.admin_email,
      admin_password : ''
    }).subscribe( data => {
      localStorage.setItem('auth_user', JSON.stringify(data.json()));
      this.loggedInUser = JSON.parse(localStorage.getItem('auth_user'));
      this.changeDetector.detectChanges();
      console.log(JSON.parse(localStorage.getItem('auth_user')));
    });
    this.editEmailForm.reset();
  }
  editPasswordFormSubmit() {
    console.log(this.editPasswordForm.value);
    this._dataService.editAdminPassword({
      admin_name: '',
      admin_email: '',
      admin_password : this.editPasswordForm.value.admin_new_password
    }).subscribe( data => {
      localStorage.setItem('auth_user', JSON.stringify(data.json()));
      this.loggedInUser = JSON.parse(localStorage.getItem('auth_user'));
      this.changeDetector.detectChanges();
      console.log(JSON.parse(localStorage.getItem('auth_user')));
    });
    this.editPasswordForm.reset();
  }
}
