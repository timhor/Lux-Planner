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
  public journeyName: string = 'Journey1';
  public stops = [{'name': 'Stop'}];
  public allJourneys = [{'journey_name': 'Journey', 'stops': []}];
  public activeJourneyIndex = 0;
  public activeStopIndex = 0;
  public aboutText: string = "Loading Information...";
  public connService: ConnectionService;

  constructor( _connectionService: ConnectionService) {
    this.connService = _connectionService;
    
    this.connService.getProtectedData('api/get_all_journeys').subscribe(
        res => {
            this.activeJourneyIndex = res.active_journey;
            this.allJourneys = res.journeys;
            this.journeyName = res.journeys[this.activeStopIndex].journey_name;
            this.stops = res.journeys[this.activeStopIndex].stops;
            console.log('Success getting journeys');
            this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
                res => {
                    this.aboutText = res.info; 
                    // console.log("About text is " + this.aboutText);   
                }        
            );
        },
        (error) => {console.log(`could not connect ${error}`)}
    );
    
}

  ngOnInit() {
  }

  getCurrStop () {
    return this.stops[this.activeStopIndex].name;
  }

  setActiveJourney(name:string) {
    if (name === this.journeyName) return;
    this.journeyName = name;
    
    for (let i=0; i < this.allJourneys.length; i++) {
      if (this.allJourneys[i].journey_name === name) {
        this.stops = this.allJourneys[i].stops;
        this.activeJourneyIndex = i;
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
      if (stop === this.stops[i].name) {
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

  getJourneyLength() {
      try {
        return this.allJourneys.length;
      } catch (e) {
        return 0;
      }
  }

}

