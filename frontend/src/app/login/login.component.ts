import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInService } from '../loggedIn.service';
// import { ConnectionService } from '../connection/connection.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public username;
  public password;
  public isChecked = false; 
  public incorrectCredentials = false;

  submitted = false;
  
  setChecked() {
    this.isChecked = !this.isChecked;
  }
  onSubmit() {
    this.submitted = true;
    console.log(this.username);
    console.log(this.password);
    this.loggedInService.login(this.username, this.password);

    // TODO should really redirect after confirming login...
    this.router.navigate(['/dashboard'])

  }

  constructor(private loggedInService: LoggedInService, public router: Router) {
                // private connection: ConnectionService) {
  }

  setLoggedIn() {
    // this.loggedInService.loggedIn = true;
    console.log("Logged In=" + this.loggedInService.loggedIn);
  }
  get diagnostic() { return("Username: " + this.username + " Password: " + this.password + " Check: " + this.isChecked); }
}
