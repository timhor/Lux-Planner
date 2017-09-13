import { Component } from '@angular/core';
import { LoggedInService } from '../loggedIn.service';

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
    
    //Add stuff here to send account details to backend
    //this.username, this.password, this.isChecked
    //And redirect to --> routerLink="/dashboard OR /journey"

  }

  constructor(private loggedInService: LoggedInService) {
  }

  setLoggedIn() {
    this.loggedInService.loggedIn = true;
    console.log("Logged In=" + this.loggedInService.loggedIn);
  }
  get diagnostic() { return("Username: " + this.username + " Password: " + this.password + " Check: " + this.isChecked); }
}
