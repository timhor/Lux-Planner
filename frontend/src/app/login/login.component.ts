import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    console.log("HELLO WORLD");
    console.log(this.username);
    console.log(this.password);
    
    //Add stuff here to send account details to backend
    //this.username, this.password, this.isChecked
    //And redirect to --> routerLink="/dashboard OR /journey"
    this.router.navigate(['/dashboard'])

  }

  constructor(private loggedInService: LoggedInService, public router: Router) {
  }

  setLoggedIn() {
    this.loggedInService.loggedIn = true;
    console.log("Logged In=" + this.loggedInService.loggedIn);
  }
  get diagnostic() { return("Username: " + this.username + " Password: " + this.password + " Check: " + this.isChecked); }
}
