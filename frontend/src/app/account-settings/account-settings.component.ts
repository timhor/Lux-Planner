import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { LoggedInService } from '../loggedIn.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { JourneyService } from '../journey.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['../app.component.css', './account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  public editAvatar:boolean = false;
  public editPassword:boolean = false;
  public editEmail:boolean = false;
  public editFirstName:boolean = false;
  public editLastName:boolean = false;

  public avatar: string;
  public username: string;
  public email: string;
  public password: string;
  public firstName: string;
  public lastName: string;

  public newAvatar: string;
  public newEmail: string;
  public newPassword: string = "";
  public newPasswordConfirm: string = "";
  public newFirstName: string;
  public newLastName: string;

  public submitted: boolean = false;
  public passwordConfirmation: string;

  constructor(
    private connService: ConnectionService,
    private loggedInService: LoggedInService,
    private notification: NotificationsService,
    private journeyService: JourneyService,
    public router: Router
  ) {

    this.connService.getProtectedData('api/get_account_details/').subscribe(
      res => {
        this.username = res.username;
        this.email = res.email;
        this.firstName = res.first_name;
        this.lastName = res.last_name;
      },
      (error) => {console.log(`could not connect ${error}`)}
  );
  }

  ngOnInit() {
    if (!this.loggedInService.loggedIn()) {
      this.router.navigate(['/login']);
    }
    //fetch account details from backend
    this.avatar = "https://dummyimage.com/250x250/000000/baffef&text=No+Image+Available";
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

  public deleteAccount(password: string) {
      this.loggedInService.deleteAccount(JSON.stringify({'password': password})).subscribe(
          res => {
              if (res.status) {
                localStorage.removeItem('id_token');
                this.journeyService.activeJourneyIndex = 0;
                this.notifyDeletion(res.status);
                this.router.navigate(['/']);
              } else {
                this.notifyDeletion(res.status);
              }
          }
      )
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
        this.editAvatar = false;
        this.editPassword = false;
        this.editEmail = false;
        this.editFirstName = false;
        this.editLastName = false;
        this.notify();
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
      },
        (error) => {console.log(`could not connect ${error}`)}
    );
  }

  notifyDeletion(status) {
    if (status) {
      this.notification.success(
        this.username,
        "Account deleted successfully"
      )
    } else {
      this.notification.error(
        "Incorrect password",
        "Could not delete account"
      )
    }
  }

  notify() {
    this.notification.success(
      this.username,
      "Account updated successfully"
    );
  }
  get diagnostic() { return("Email: " + this.newEmail + " Password: " + this.newPassword) + " Confirm: " + this.newPasswordConfirm }
}
