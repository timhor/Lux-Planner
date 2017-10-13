import { Component } from '@angular/core';
import { LoggedInService } from './loggedIn.service';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { TooltipModule } from "ngx-tooltip";
import { NotificationsService } from 'angular2-notifications';
import { JourneyService } from './journey.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  public title = 'LUX: Holiday Planner';
  public username: string = 'Username';

  constructor(
    private loggedInService: LoggedInService, 
    public router: Router, 
    private notifications: NotificationsService,
    private journeyService: JourneyService
  ) {}

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
    this.journeyService.activeJourneyIndex = 0;
    this.notifications.success(
      this.username,
      "Logged out successfully"
    )
  }

  onDeactivate() {
    window.scrollTo(0,0);
  }

  public options = {
    position: ["bottom", "right"],
    timeOut: 1500,
    showProgressBar: false
  }

}
