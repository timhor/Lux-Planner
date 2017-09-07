import { Component } from '@angular/core';
import { LoggedInService } from '../loggedIn.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  
  constructor(private loggedInService: LoggedInService) {
  }

  setLoggedIn() {
    this.loggedInService.loggedIn = true;
    console.log(this.loggedInService.loggedIn);
  }
}
