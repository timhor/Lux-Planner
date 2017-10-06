import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StopComponent } from '../stop/stop.component';
import { ItineraryComponent } from '../itinerary/itinerary.component';
import { ConnectionService } from '../connection/connection.service';
import { LoggedInService } from '../loggedIn.service';
import { JourneyService } from '../journey.service';
import { NotificationsService } from 'angular2-notifications';
import { HorizontalTimelineComponent } from '../horizontal-timeline/horizontal-timeline.component';
import { TimelineElement } from '../horizontal-timeline/timeline-element';
import { MapsAPILoader } from '@agm/core';

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
  public stops = [{'name': 'Stop', 'arrival': '', 'departure': '', 'lat': 0, 'lng': 0, 'notes': ''}];
  public allJourneys = [{'journey_name': 'Journey','start_location': 'Sydney', 'start': '01/01/2017', 'end': '01/02/2017', 'stops': []}];
  public activeJourneyIndex: number = 0;
  public activeStopIndex: number = 0;
  public aboutText: string = "Loading Information...";
  public latitude: number;
  public longitude: number;
  public weatherUrl: string = "Nothing";
  public mapUrl: string = "Nothing";
  private toRefresh:boolean = false;
  private firstLoad:boolean;
  private isModifyingNotes = false;
  private newNotes: string = "";
  events: Array<any>;
  private bounds;
  private startingLocation;

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
            this.setTimeline();
            this.updateMap();
            this.setActiveJourney(this.journeyName);
        },
        (error) => {console.log(`could not connect ${error}`)}
    );
  }

  content = "";

  timeline = [
    { caption: '16 Jan', date: new Date(2014, 1, 16), selected: true, title: 'Horizontal Timeline', content: this.content },
    { caption: '28 Feb', date: new Date(2014, 2, 28), title: 'Event title here', content: this.content },
    { caption: '20 Mar', date: new Date(2014, 3, 20), title: 'Event title here', content: this.content },
    { caption: '20 May', date: new Date(2014, 5, 20), title: 'Event title here', content: this.content },
    { caption: '09 Jul', date: new Date(2014, 7, 9), title: 'Event title here', content: this.content },
    { caption: '30 Aug', date: new Date(2014, 8, 30), title: 'Event title here', content: this.content },
    { caption: '15 Sep', date: new Date(2014, 9, 15), title: 'Event title here', content: this.content },
    { caption: '01 Nov', date: new Date(2014, 11, 1), title: 'Event title here', content: this.content },
    { caption: '10 Dec', date: new Date(2014, 12, 10), title: 'Event title here', content: this.content },
    { caption: '29 Jan', date: new Date(2015, 1, 19), title: 'Event title here', content: this.content },
    { caption: '3 Mar', date: new Date(2015, 3, 3), title: 'Event title here', content: this.content },
  ]

  ngOnInit() {
    if (!this.loggedInService.loggedIn()) {
      this.router.navigate(['/login']);
    }    
  }

  setTimeline() {
    this.events = new Array<any>();
    let startDate;
    let endDate;
    this.startingLocation;

    startDate = this.allJourneys[this.activeJourneyIndex].start;
    endDate = this.allJourneys[this.activeJourneyIndex].end;
    if (!this.allJourneys[this.activeJourneyIndex].start_location) {
      this.startingLocation = "Start Location";
    } else {
      this.startingLocation = this.allJourneys[this.activeJourneyIndex].start_location;
    }

    this.events.push({ "date": new Date(startDate), "header": this.startingLocation, "icon": "fa-plane"});

    for (let i=0; i < this.stops.length; i++) {
      this.events.push({ "date": new Date(this.stops[i].arrival), "header": this.stops[i].name });
    }

    this.events.push({ "date": new Date(endDate), "header": this.startingLocation, "icon": "fa-flag-checkered" });
  }

  getCurrStop () {
    return this.stops[this.activeStopIndex].name;
  }

  getStop (i:number) {
    return this.stops[i].name;
  }

  setActiveJourney(name:string) {
    if (!this.firstLoad) {
      this.firstLoad = true;
    }

    this.journeyName = name;
    this.stops = this.allJourneys[this.activeJourneyIndex].stops;
    this.activeJourneyIndex = this.activeJourneyIndex;
    this.activeStopIndex = 0;

    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
      res => {
          this.aboutText = res.info;
      }
    );

    this.checkForOverview();  // Check if current page is overview
    this.setTimeline();
    this.updateMap();   
    this.startingLocation = this.allJourneys[this.activeJourneyIndex].start_location;    
  }

  setActiveStop(stop:string) {
    this.firstLoad = false;
    for (let i=0; i < this.stops.length; i++) {
      if (stop === this.stops[i].name) {
        this.activeStopIndex = i;
        break;
      }
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

  modifyNotes() {
    this.isModifyingNotes = !this.isModifyingNotes;
    this.newNotes = this.stops[this.activeStopIndex].notes;
  }

  cancelNotes() {
    this.isModifyingNotes = !this.isModifyingNotes;
  }

  saveNotes() {
    this.stops[this.activeStopIndex].notes = this.newNotes;
    this.isModifyingNotes = !this.isModifyingNotes;
    this.pushNotes("updated");
  }

  deleteNotes() {
    // TODO - add warning
    this.isModifyingNotes = !this.isModifyingNotes;
    this.stops[this.activeStopIndex].notes = null;
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

  updateMap(){
    this.mapsAPILoader.load().then(() => {
      this.bounds = new google.maps.LatLngBounds();
      for (let i=0; i < this.stops.length; i++){
        var marker = new google.maps.Marker({position: {lat: this.stops[i].lat, lng: this.stops[i].lng}});
        this.bounds.extend(marker.getPosition());
      }
      var startMarker = new google.maps.Marker({position: {lat: -33.86514, lng: 151.20990}});
      this.bounds.extend(startMarker.getPosition());
    });
  }
}
