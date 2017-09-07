import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  public editPassword:boolean = false;
  public editEmail:boolean = false;
  constructor() { }

  ngOnInit() {
  }

  updatePassword() {
    this.editPassword = !this.editPassword;
  }

  updateEmail() {
    this.editEmail = !this.editEmail;
  }
}
