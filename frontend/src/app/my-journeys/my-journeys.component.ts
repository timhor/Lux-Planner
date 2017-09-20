import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';

@Component({
  selector: 'app-my-journeys',
  templateUrl: './my-journeys.component.html',
  styleUrls: ['../app.component.css', './my-journeys.component.css']
})
export class MyJourneysComponent implements OnInit {
  public allJourneys = [{'journey_name': 'Journey', 'stops': []}];
  public connService: ConnectionService;
  constructor( _connectionService: ConnectionService) {
    this.connService = _connectionService; 
  }

  ngOnInit() {
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
