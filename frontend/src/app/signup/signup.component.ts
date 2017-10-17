import { Component } from '@angular/core';
import { NewAccount } from './newaccount';
import { Router } from '@angular/router';
import { LoggedInService } from '../loggedIn.service';
import { NotificationsService } from 'angular2-notifications'


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../app.component.css', './signup.component.css']
})
export class SignupComponent {
  account = new NewAccount('','','','','','');
  public usernameTakenMsg: string = '';
  public completedRequiredFields: boolean = true;

  constructor(private loggedInService: LoggedInService, public router: Router, public notification: NotificationsService) {}

  onSubmit() {
    this.completedRequiredFields = true;
    if (this.account.username == '' || this.account.password == '' || this.account.email == '' || this.account.confirmPassword == '') {
        this.completedRequiredFields = false;
        return;
    }
    if (this.account.password.length < 0 || this.account.password != this.account.confirmPassword) {
        return;
    }
    let response = this.loggedInService.signup(this.account.username, this.account.password,
        this.account.email, this.account.firstName, this.account.lastName);
    response.subscribe(
        (data) => {
            if (data.message == 'success') {
                let response = this.loggedInService.login(this.account.username, this.account.password);
                response.subscribe(
                    (data) => {
                        let token = data.access_token;
                        localStorage.setItem('id_token', token);  // 'id_token' is the default location AuthHTTP looks for
                        this.notify()
                        this.router.navigate(['/journey'])
                        window.scrollTo(0,0);

                    },
                    (error) => {
                        console.log(`This shouldn't happen anyways: ${error}`);
                        this.router.navigate(['/login'])
                    }
                )
            } else {
                this.usernameTakenMsg = this.account.username;
            }
        },
        (error) => {
            console.log(`Sumting wong: ${error}`);
        }
    )
  }

  notify() {
    this.notification.success(
      this.account.username,
      "Account created successfully",
    );
  }

  // For debugging
  get diagnostic() { return JSON.stringify(this.account); }
}
