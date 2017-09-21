import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { LoggedInService } from '../loggedIn.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-journeys',
  templateUrl: './my-journeys.component.html',
  styleUrls: ['../app.component.css', './my-journeys.component.css']
})
export class MyJourneysComponent implements OnInit {
  public allJourneys = [{'journey_name': 'Journey', 'stops': []}];
  public connService: ConnectionService;
  public loggedInService
  constructor( _connectionService: ConnectionService, _loggedinService: LoggedInService, public router: Router) {
    this.connService = _connectionService; 
    this.loggedInService = _loggedinService;
  }

  ngOnInit() {
    if (!this.loggedInService.loggedIn()) {
      this.router.navigate(['/login']);
    }
    this.connService.getProtectedData('api/get_all_journeys').subscribe(
      res => {
          this.allJourneys = res.journeys;
          console.log('Success getting journeys');
          console.log(res);            
      },
      (error) => {console.log(`could not connect ${error}`)}
    ); 
  }

}
