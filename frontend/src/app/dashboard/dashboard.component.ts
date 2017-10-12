import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StopComponent } from '../stop/stop.component';
import { ItineraryComponent } from '../itinerary/itinerary.component';
import { ConnectionService } from '../connection/connection.service';
import { LoggedInService } from '../loggedIn.service';
import { JourneyService } from '../journey.service';
import { NotificationsService } from 'angular2-notifications';
import { MapsAPILoader } from '@agm/core';
import { WeatherSettings, TemperatureScale, ForecastMode, WeatherLayout } from 'angular-weather-widget';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../app.component.css', './dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public connService: ConnectionService;
  public loggedInService: LoggedInService;
  public journeyService: JourneyService;
  public journeyName: string = 'Journey1';
  public stops = [{'name': 'Stop',
                  'arrival': '',
                  'departure': '',
                  'lat': 0,
                  'lng': 0,
                  'notes': ''
                }];
  public allJourneys = [{'journey_name': 'Journey',
                        'start_location': 'Sydney',
                        'start': '01/01/2017',
                        'end': '01/02/2017',
                        'lat': 0,
                        'lng': 0,
                        'stops': []
                      }];
  public activeJourneyIndex: number = 0;
  public activeStopIndex: number = 0;
  public aboutText: string = "Loading Information...";
  public latitude: number;
  public longitude: number;
  public weatherUrl: string = "Nothing";
  public mapUrl: string = "Nothing";
  private toRefresh:boolean = false;
  private firstLoad:boolean;
  private newNotes: string = "";
  events: Array<any>;
  private bounds;
  public startingLocationName;
  // private startingLocationLatitude = -33.86514;
  // private startingLocationLongitude = 151.20990;
  settings: WeatherSettings = {
    location: {
      cityName: 'Sydeny'
    },
    backgroundColor: 'transparent',
    color: '#424242',
    width: '100%',
    height: 'auto',
    showWind: false,
    scale: TemperatureScale.CELCIUS,
    forecastMode: ForecastMode.GRID,
    showDetails: false,
    showForecast: true,
    layout: WeatherLayout.WIDE,
    language: 'en'
  };
  
  constructor(_connectionService: ConnectionService, public sanitizer: DomSanitizer, _loggedinService: LoggedInService, 
      public router: Router, _journeyService: JourneyService, private notification: NotificationsService, private mapsAPILoader: MapsAPILoader) {
    this.connService = _connectionService;
    this.loggedInService = _loggedinService;
    this.journeyService = _journeyService;
    this.firstLoad = true;
    this.mapsAPILoader.load().then(() => {this.bounds = new google.maps.LatLngBounds();})

    this.connService.getProtectedData('api/get_all_journeys').subscribe(
        res => {
            if (res.journeys.length == 0) {
                // No journeys, direct them to make a journey :)
                this.notifyRedirect();
                setTimeout(() => {
                  this.router.navigate(['/journey']);
                }, 500)
                return;
            }
            // this.activeJourneyIndex = res.active_journey;
            this.activeJourneyIndex = this.journeyService.activeJourneyIndex;
            this.allJourneys = res.journeys;
            this.journeyName = res.journeys[this.activeJourneyIndex].journey_name;
            this.stops = res.journeys[this.activeStopIndex].stops;
            this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
                res => {
                    this.aboutText = res.info;
                }
            );
            this.checkForOverview();  // Check if current page is overview
            this.firstLoad = false;
            this.updateMap();
            this.setActiveJourney(this.journeyName);
        },
        (error) => {console.log(`could not connect ${error}`)}
    );
  }

  ngOnInit() {
    if (!this.loggedInService.loggedIn()) {
      this.router.navigate(['/login']);
    }    
  }

  getCurrStop () {
    return this.stops[this.activeStopIndex].name;
  }

  getStop (i:number) {
    return this.stops[i].name;
  }

  setActiveJourney(journey:string) {
    if (!this.firstLoad) {
      this.firstLoad = true;
    }

    for (let i=0; i < this.allJourneys.length; i++) {
      if (journey === this.allJourneys[i].journey_name) {
        this.activeJourneyIndex = i;
        break;
      }
    }

    this.journeyName = journey;
    this.stops = this.allJourneys[this.activeJourneyIndex].stops;
    this.activeStopIndex = 0;
    
    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
      res => {
          this.aboutText = res.info;
      }
    );

    this.checkForOverview();  // Check if current page is overview
    this.updateMap();   
    this.startingLocationName = this.allJourneys[this.activeJourneyIndex].start_location;    
    // this.setTimelineWidth();
  }

  setActiveStop(stop:string) {
    this.firstLoad = false;
    for (let i=0; i < this.stops.length; i++) {
      if (stop === this.stops[i].name) {
        this.activeStopIndex = i;
        break;
      }
    }
    if (this.stops[this.activeStopIndex].notes === undefined) {
      this.newNotes = null;
    } else {
      this.newNotes = this.stops[this.activeStopIndex].notes;
    }
    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
      res => {
          this.aboutText = res.info;
      }
    );
    this.checkForOverview();  // Check if current page is overview
    this.updateMap();
  }

  getJourneyLength() {
      try {
        return this.allJourneys.length;
      } catch (e) {
        return 0;
      }
  }

  checkForOverview(){
    if (this.firstLoad){
      this.activeStopIndex = -1;
    }
  }

  shortStop(string) {
    if (!string) {
      return "Start";
    }
    return string.replace(/,.*/,'');
  }

  shortAbout() {
    let sentences = this.aboutText.match(/^(.*?\..*?)\.(\s|<\/p>)/); // get first two sentences from aboutText
    if (sentences) {
      let text = sentences[0]; // only want the first match
      return text;
    } else {
      return "<em>No information found.</em>"
    }
  }

  public resetFirstLoad(): void {
    this.firstLoad = true;
    this.activeStopIndex = -1;
  }

  cancelNotes() {
    this.newNotes = this.stops[this.activeStopIndex].notes;
  }

  saveNotes() {
    this.stops[this.activeStopIndex].notes = this.newNotes;
    this.pushNotes("updated");
  }

  deleteNotes() {
    this.stops[this.activeStopIndex].notes = null;
    this.newNotes = null;
    this.pushNotes("deleted");
  }

  pushNotes(action: string) {
    let payload = {'jIndex': this.activeJourneyIndex,
        'sIndex': this.activeStopIndex,
        'notes': this.stops[this.activeStopIndex].notes
    };
    this.loggedInService.updateNotes(JSON.stringify(payload)).subscribe(
        (res) => {
          this.notifyUpdate(action);
          console.log("pushed to server successfully");
        }

    )
  }

  notifyRedirect() {
    this.notification.error(
      "No Existing Journeys",
      "Redirecting...",
      {
        timeOut: 2500,
        showProgressBar: true
      }
    );
  }

  notifyUpdate(action: string) {
    this.notification.success(
      this.stops[this.activeStopIndex].name,
      "Notes " + action + " successfully"
    )
  }

  updateMap() {
    this.mapsAPILoader.load().then(() => {
      this.bounds = new google.maps.LatLngBounds();
      for (let i=0; i < this.stops.length; i++){
        var marker = new google.maps.Marker({position: {lat: this.stops[i].lat, lng: this.stops[i].lng}});
        this.bounds.extend(marker.getPosition());
      }
      // var startMarker = new google.maps.Marker({position: {lat: -33.86514, lng: 151.20990}});
      var currJourney = this.allJourneys[this.activeJourneyIndex];
      var startMarker = new google.maps.Marker({position: {lat: currJourney.lat, lng: currJourney.lng}});
      this.bounds.extend(startMarker.getPosition());
    });
  }

  // setTimelineWidth() {
  //   let element: HTMLElement = document.getElementById('timeline-buttons');
  //   let timelineWidth = Math.round((window.screen.width*0.05)*2*(this.stops.length+2)) + 30*(this.stops.length+2);
  //   console.log(timelineWidth);
  //   console.log(0.65*window.screen.width);
  //   if (timelineWidth > 0.65*window.screen.width) {
  //     element.setAttribute('style', "width: " + timelineWidth + "px");
  //   } else {
  //     element.setAttribute('style', "width: 100%");
  //   }
  // }
}
