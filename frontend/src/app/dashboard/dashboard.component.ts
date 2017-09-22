import { Component, OnInit } from '@angular/core';
import { StopComponent } from '../stop/stop.component';
import { ConnectionService } from '../connection/connection.service';
import { ItineraryComponent } from '../itinerary/itinerary.component';
import { DomSanitizer } from '@angular/platform-browser';
import { LoggedInService } from '../loggedIn.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../app.component.css', './dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public journeyName: string = 'Journey1';
  public stops = [{'name': 'Stop', 'lat': 0, 'lng': 0}];
  public allJourneys = [{'journey_name': 'Journey', 'stops': []}];
  public activeJourneyIndex = 0;
  public activeStopIndex = 0;
  public aboutText: string = "Loading Information...";
  public connService: ConnectionService;
  public latitude; //  = "42.35000000000000142108547152020037174224853515625";
  public longitude; //: string = "-71.0666666700000035916673368774354457855224609375";
  public weatherUrl: string = "Nothing";
  public mapUrl: string = "Nothing";
  public loggedInService: LoggedInService;
  private toRefresh:boolean = false;  

  constructor( _connectionService: ConnectionService, public sanitizer: DomSanitizer, _loggedinService: LoggedInService, public router: Router) {
    this.connService = _connectionService;
    this.loggedInService = _loggedinService;

    this.connService.getProtectedData('api/get_all_journeys').subscribe(
        res => {
            this.activeJourneyIndex = res.active_journey;
            this.allJourneys = res.journeys;
            this.journeyName = res.journeys[this.activeJourneyIndex].journey_name;
            this.stops = res.journeys[this.activeStopIndex].stops;
            // console.log('Success getting journeys');
            // console.log(res);
            
            this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
                res => {
                    this.aboutText = res.info; 
                }                
            );
            this.setUrls(this.getCurrStop());            
        },
        (error) => {console.log(`could not connect ${error}`)}
    ); 
    this.aboutText = this.regInfo(this.aboutText);   
  }

  ngOnInit() {
    if (!this.loggedInService.loggedIn()) {
      this.router.navigate(['/login']);
    }
    this.setUrls(this.getCurrStop()); 
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
        this.activeStopIndex = 0;
        break;
      }
    }
    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
      res => {
          this.aboutText = res.info; 
          // console.log("About text is " + this.aboutText);   
      }        
    );
    this.setUrls(this.getCurrStop());        
  }

  setActiveStop(stop:string) {
    // document.getElementById('weather-forecast').innerHTML = "";
    
    for (let i=0; i < this.stops.length; i++) {
      if (stop === this.stops[i].name) {
        this.activeStopIndex = i;
      }
    }
    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
      res => {
          this.aboutText = res.info; 
          // console.log("About text is " + this.aboutText);   
      }        
    );
    this.setUrls(this.getCurrStop());  

    // document.getElementById('weather-forecast').innerHTML = '<iframe width="100%" height="100%" display="block" frameborder="0" style="border:0" [src]=&#39;sanitizer.bypassSecurityTrustResourceUrl(mapUrl)&#39; allowfullscreen></iframe>';  
  }

  getJourneyLength() {
      try {
        return this.allJourneys.length;
      } catch (e) {
        return 0;
      }
  }

  setUrls(stopName:string){
    // this.weatherUrl = "//forecast.io/embed/#lat=" + this.latitude + "&lon=" + this.longitude + "&units=uk";
    // this.weatherUrl = "https://forecast.io/embed/#lat=" + this.stops[this.activeStopIndex].lat + "&lon=" + this.stops[this.activeStopIndex].lng + "&units=uk&color=#000037";
    // console.log("==================> The weather url is : " + this.weatherUrl);
    this.mapUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAWhdBjPKjj_DNstBfp3i65VTtCeEzucyc&q=" + stopName + " City";  
  }

  regStop(string) {
    return string.replace(/,.*/,'');
  }
  regInfo(string) {
    return string.replace(/\\n/,'\n\n');
  }
}

