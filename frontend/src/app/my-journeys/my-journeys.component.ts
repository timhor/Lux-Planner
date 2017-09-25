import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { LoggedInService } from '../loggedIn.service';
import { Router } from '@angular/router';
import { ModifyJourneyService } from '../modify-journey.service';

@Component({
  selector: 'app-my-journeys',
  templateUrl: './my-journeys.component.html',
  styleUrls: ['../app.component.css', './my-journeys.component.css']
})
export class MyJourneysComponent implements OnInit {
  public allJourneys = [{'journey_name': 'Journey', 'stops': []}];
  public connService: ConnectionService;
  public loggedInService: LoggedInService;
  public modifyJourneyService: ModifyJourneyService;

  constructor(
    _connectionService: ConnectionService,
    _loggedinService: LoggedInService,
    public router: Router,
    _modifyJourneyService: ModifyJourneyService
  ) {
    this.connService = _connectionService; 
    this.loggedInService = _loggedinService;
    this.modifyJourneyService = _modifyJourneyService;
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

  setModify(index:number) {
    this.modifyJourneyService.isModifying = true;
    this.modifyJourneyService.journeyIndex = index;
    this.router.navigate(['/journey']);
  }

}
