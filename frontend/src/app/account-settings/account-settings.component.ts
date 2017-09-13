import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  public editAvatar:boolean = false;
  public editPassword:boolean = false;
  public editEmail:boolean = false;

  public avatar;
  public username;
  public email;
  public password;

  public newAvatar;
  public newEmail;
  public newPassword = "";
  public newPasswordConfirm = "";

  submitted = false;

  constructor() { }
    
  ngOnInit() {
    //fetch account details from backend
    //TODO: replace literals with details
    this.avatar = "https://dummyimage.com/250x250/000/fff";
    this.username = "Username";
    this.email = "userEmail@mail.com";
    this.password = "!@#$%^&*()";
  }

  updateAvatar() {
    this.editAvatar = !this.editAvatar;
  }

  updatePassword() {
    this.editPassword = !this.editPassword;
  }

  updateEmail() {
    this.editEmail = !this.editEmail;
  }

  onSubmit() {
    this.submitted = true;
    
    //Add stuff here to send account details to backend
    //this.newAvatar, this.newPassword, this.newPasswordConfirm, this.newEmail
  }
  get diagnostic() { return("Email: " + this.newEmail + " Password: " + this.newPassword) + " Confirm: " + this.newPasswordConfirm }  
}
