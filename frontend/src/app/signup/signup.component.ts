import { Component } from '@angular/core';
import { NewAccount } from './newaccount';
import { Router } from '@angular/router';
import { LoggedInService } from '../loggedIn.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  account = new NewAccount('','','','');

  constructor(private loggedInService: LoggedInService, public router: Router) {}
  

//   submitted = false;

  onSubmit() {
    // this.submitted = true;

    console.log(this.account.username);
    console.log(this.account.password);
    console.log(this.account.confirmPassword);    
    console.log(this.account.email);

    let response = this.loggedInService.signup(this.account.username, this.account.password, this.account.email);
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
            // this.incorrectCredentials = true;
        }
    )
    
    //Add stuff here to send account details to backend
    //And redirect to --> routerLink="/login"

  }

  // For debugging
  get diagnostic() { return JSON.stringify(this.account); }
}
