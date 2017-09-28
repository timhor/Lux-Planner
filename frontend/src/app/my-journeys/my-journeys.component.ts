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
  public loggedInService: LoggedInService;

  constructor(
    _connectionService: ConnectionService,
    _loggedinService: LoggedInService,
    public router: Router,
  ) {
    this.connService = _connectionService; 
    this.loggedInService = _loggedinService;
  }

  ngOnInit() {
    if (!this.loggedInService.loggedIn()) {
      this.router.navigate(['/login']);
    }
    this.getJourneyList();
    // this.connService.getProtectedData('api/get_all_journeys').subscribe(
    //   res => {
    //       this.allJourneys = res.journeys;
    //       console.log('Success getting journeys');    
    //   },
    //   (error) => {console.log(`could not connect ${error}`)}
    // ); 
  }

  setModify(i:number) {
    this.router.navigate(['/modify', i]);
  }

  deleteJourney(i:number) {
      this.loggedInService.deleteJourney(JSON.stringify({'delete': i})).subscribe(
          (res) => {
            // this.router.navigate(['/my-journeys'])
            this.getJourneyList();
          },
          (error) => {console.log("Could not delete")}
      )
  }

  getJourneyList() {
    this.connService.getProtectedData('api/get_all_journeys').subscribe(
        res => {
            this.allJourneys = res.journeys;
            console.log('Success getting journeys');    
        },
        (error) => {console.log(`could not connect ${error}`)}
    ); 
  }

}
