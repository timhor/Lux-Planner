import { Component } from '@angular/core';
import { LoggedInService } from './loggedIn.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  public title = 'LUX: Holiday Planner';

  constructor(private loggedInService: LoggedInService, private router: Router) {
  }

  isLoggedIn() {
    return this.loggedInService.loggedIn;
  }
}
