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
  public editFirstName:boolean = false;
  public editLastName:boolean = false;

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
  public newFirstName;
  public newLastName;

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
    this.password = "••••••••";
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

  updateFirstName() {
    this.editFirstName = !this.editFirstName;
  }

  updateLastName() {
    this.editLastName = !this.editLastName;
  }

  onSubmit() {
    if ((this.newPassword.length < 8 && this.newPassword.length > 0) || this.newPassword != this.newPasswordConfirm) {
      return;
    }
    this.submitted = true;
    var payload: any = {};
    if (this.editPassword == true) payload.password = this.newPassword;
    if (this.editEmail == true) payload.email = this.newEmail;
    if (this.editFirstName == true) payload.firstName = this.newFirstName;
    if (this.editLastName == true) payload.lastName = this.newLastName;
    let response = this.loggedInService.changeDetails(payload);
    response.subscribe(
      (data) => {
        console.log(data.message);
        this.editAvatar = false;
        this.editPassword = false;
        this.editEmail = false;
        this.editFirstName = false;
        this.editLastName = false;
      },
        (error) => {
        console.log(`Sumting wong: ${error}`);
        }
    );

    this.connService.getProtectedData('api/get_account_details/').subscribe(
      res => {
        this.username = res.username;
        this.email = res.email;
        this.firstName = res.first_name;
        this.lastName = res.last_name;
        this.gender = res.gender;
        console.log('Success updating account details');
      },
        (error) => {console.log(`could not connect ${error}`)}
    );
    //Add stuff here to send account details to backend
    //this.newAvatar, this.newPassword, this.newPasswordConfirm, this.newEmail
  }
  get diagnostic() { return("Email: " + this.newEmail + " Password: " + this.newPassword) + " Confirm: " + this.newPasswordConfirm }  
}
