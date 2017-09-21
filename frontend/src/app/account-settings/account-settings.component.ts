import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { LoggedInService } from '../loggedIn.service';
import { Router } from '@angular/router';

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
  public firstName;
  public lastName;
  public gender;
  public connService: ConnectionService;
  public loggedInService: LoggedInService;

  public newAvatar;
  public newEmail;
  public newPassword = "";
  public newPasswordConfirm = "";

  submitted = false;

  constructor( _connectionService: ConnectionService, _loggedinService: LoggedInService, public router: Router) { 
    this.connService = _connectionService;
    this.loggedInService = _loggedinService;

    this.connService.getProtectedData('api/get_account_details/').subscribe(
      res => {
        this.username = res.username;
        this.email = res.email;
        this.firstName = res.first_name;
        this.lastName = res.last_name;
        this.gender = res.gender;
        console.log('Success getting account details');   
      },
      (error) => {console.log(`could not connect ${error}`)}
  );
  }
    
  ngOnInit() {
    if (!this.loggedInService.loggedIn()) {
      this.router.navigate(['/login']);
    }
    //fetch account details from backend
    //TODO: replace literals with details
    this.avatar = "https://dummyimage.com/250x250/000000/baffef&text=No+Image+Available";
    //this.username = "Username";
    //this.email = "userEmail@mail.com";
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
