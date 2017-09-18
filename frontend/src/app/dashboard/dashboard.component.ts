import { Component, OnInit } from '@angular/core';
import { StopComponent } from '../stop/stop.component';
import { ConnectionService } from '../connection/connection.service';
import { ItineraryComponent } from '../itinerary/itinerary.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public journeyName: string = 'Journey1'; //set as empty for all once backend works
  public stops: string[] = ['Tokyo', 'Hong Kong', 'Singapore']; 
  public allJourneys: string[] = ['Journey1', 'Journey2', 'Journey3'];
  public activeJourneyIndex = 0;
  public activeStopIndex = 0;
  public aboutText: string = "Loading Information...";
  public connService: ConnectionService;

  constructor( _connectionService: ConnectionService) {
    this.connService = _connectionService;
    
    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
        res => {
            this.aboutText = res.info; 
            console.log("About text is " + this.aboutText);   
        }        
    );
    this.connService.getProtectedData('api/get_all_journeys').subscribe(
      res => {
          this.activeJourneyIndex = res.active_journey;
          this.allJourneys = res.journeys;
          this.journeyName = res.journeys[this.activeStopIndex].journey_name;
          this.stops = res.journeys[this.activeStopIndex].stops;
          console.log('Success getting journeys');
        },
        (error) => {console.log(`could not connect ${error}`)}
    );
    
}

  ngOnInit() {
  }

  getCurrStop () {
    //temporarily. Should something check which is active
    return this.stops[this.activeStopIndex];
  }

  setActiveJourney(name:string) {
    // console.log(name);
    if (name === this.journeyName) return;
    this.journeyName = name;
    
    for (let i=0; i < this.allJourneys.length; i++) {
      // TODO replace with allJourneys[i].journey_name
      if (this.allJourneys[i] === name) {
        //this.stops = this.allJourneys[i].stops; <-- Uncomment this after
        this.activeJourneyIndex = i;
        // console.log(this.activeIndex);
        break;
      }
    }
    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
      res => {
          this.aboutText = res.info; 
          console.log("About text is " + this.aboutText);   
      }        
    );
  }

  setActiveStop(stop:string) {
    for (let i=0; i < this.stops.length; i++) {
      if (stop === this.stops[i]) {
        this.activeStopIndex = i;
      }
    }
    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
      res => {
          this.aboutText = res.info; 
          console.log("About text is " + this.aboutText);   
      }        
    );
  }

}

