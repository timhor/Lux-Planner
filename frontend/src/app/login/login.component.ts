import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInService } from '../loggedIn.service';

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
  
  setChecked() {
    this.isChecked = !this.isChecked;
  }
  onSubmit() {
    let response = this.loggedInService.login(this.username, this.password);
    response.subscribe(
        (data) => {
            let token = data.access_token;
            localStorage.setItem('id_token', token);  // 'id_token' is the default location AuthHTTP looks for
            this.router.navigate(['/dashboard'])
        },
        (error) => {
            console.log(`Sumting wong: ${error}`);
            this.incorrectCredentials = true;
        }
    )
  }

  constructor(private loggedInService: LoggedInService, public router: Router) {}
  
  setLoggedIn() {
    console.log("Logged In=" + this.loggedInService.loggedIn);
  }
  get diagnostic() { return("Username: " + this.username + " Password: " + this.password + " Check: " + this.isChecked); }
}
