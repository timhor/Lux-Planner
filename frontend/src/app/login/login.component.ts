import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInService } from '../loggedIn.service';
import { NotificationsService } from 'angular2-notifications';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.css', './login.component.css'],
})
export class LoginComponent {
  public username;
  public password;
  public isChecked = true; 
  public incorrectCredentials = false;

  constructor(private loggedInService: LoggedInService, public router: Router, private notification: NotificationsService) {}
  
  setChecked() {
    this.isChecked = !this.isChecked;
  }
  onSubmit() {
    let response = this.loggedInService.login(this.username, this.password);
    response.subscribe(
        (data) => {
            let token = data.access_token;
            localStorage.setItem('id_token', token);  // 'id_token' is the default location AuthHTTP looks for
            this.notify();
            this.router.navigate(['/dashboard']);
            window.scrollTo(0,0);

        },
        (error) => {
            console.log(`Sumting wong: ${error}`);
            this.incorrectCredentials = true;
        }
    )
  }
  
  setLoggedIn() {
    console.log("Logged In=" + this.loggedInService.loggedIn);
  }

  notify() {
    this.notification.success(
      this.username,
      "Logged in successfully",
    );
  }

  get diagnostic() { return("Username: " + this.username + " Password: " + this.password + " Check: " + this.isChecked); }
}
