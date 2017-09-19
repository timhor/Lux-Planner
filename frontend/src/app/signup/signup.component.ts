import { Component } from '@angular/core';
import { NewAccount } from './newaccount';
import { Router } from '@angular/router';
import { LoggedInService } from '../loggedIn.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../app.component.css', './signup.component.css']
})
export class SignupComponent {
  account = new NewAccount('','','','','','','');

  constructor(private loggedInService: LoggedInService, public router: Router) {}
  
  onSubmit() {
    let response = this.loggedInService.signup(this.account.username, this.account.password, this.account.email, this.account.firstName, this.account.lastName, this.account.gender);
    response.subscribe(
        (data) => {
            if (data.message == 'success') {
                let response = this.loggedInService.login(this.account.username, this.account.password);
                response.subscribe(
                    (data) => {
                        let token = data.access_token;
                        localStorage.setItem('id_token', token);  // 'id_token' is the default location AuthHTTP looks for
                        this.router.navigate(['/dashboard'])
                    },
                    (error) => {
                        console.log(`This shouldn't happen anyways: ${error}`);
                        this.router.navigate(['/login'])                        
                    }
                )
            }
        },
        (error) => {
            console.log(`Sumting wong: ${error}`);
        }
    )
  }

  // For debugging
  get diagnostic() { return JSON.stringify(this.account); }
}
