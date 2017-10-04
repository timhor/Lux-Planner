import { Component } from '@angular/core';
import { LoggedInService } from './loggedIn.service';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { TooltipModule } from "ngx-tooltip";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  public title = 'LUX: Holiday Planner';
  public username: String = 'Username';

  constructor(private loggedInService: LoggedInService, private router: Router, ) {}

  public isLoggedIn() {
    try {
        let jwtHelper: JwtHelper = new JwtHelper();    
        let token: string = localStorage.getItem('id_token');
        let decoded = jwtHelper.decodeToken(token);
        this.username = decoded.identity[1];
    } catch (e) {
        // Do nothing, user not logged in
    }
    return this.loggedInService.loggedIn();
  }

  public logout() {
    localStorage.removeItem('id_token');
  }

  onDeactivate() {
    window.scrollTo(0,0);
  }
}
