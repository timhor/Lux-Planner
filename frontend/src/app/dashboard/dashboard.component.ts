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
  public stops = [{'name': 'Stop', 'arrival': '', 'departure': '', 'lat': 0, 'lng': 0, 'notes': ''}];
  public allJourneys = [{'journey_name': 'Journey','start_location': 'Sydney', 'start': '01/01/2017', 'end': '01/02/2017', 'stops': []}];
  public activeJourneyIndex = 0;
  public activeStopIndex = 0;
  public aboutText: string = "Loading Information...";
  public connService: ConnectionService;
  public latitude;
  public longitude;
  public weatherUrl: string = "Nothing";
  public mapUrl: string = "Nothing";
  public loggedInService: LoggedInService;
  private toRefresh:boolean = false;  
  private firstLoad:boolean;
  private isModifyingNotes = false;
  private newNotes = "";
  events: Array<any>;

  constructor( _connectionService: ConnectionService, public sanitizer: DomSanitizer, _loggedinService: LoggedInService, public router: Router) {
    this.connService = _connectionService;
    this.loggedInService = _loggedinService;
    this.firstLoad = true;

    this.connService.getProtectedData('api/get_all_journeys').subscribe(
        res => {
            if (res.journeys.length == 0) {
                // No journeys, direct them to make a journey :)
                this.router.navigate(['/journey']);
                return;
            }
            this.activeJourneyIndex = res.active_journey;
            this.allJourneys = res.journeys;
            this.journeyName = res.journeys[this.activeJourneyIndex].journey_name;
            this.stops = res.journeys[this.activeStopIndex].stops;            
            this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
                res => {
                    this.aboutText = res.info; 
                }                
            );
            this.setUrls(this.getCurrStop());     // Refresh the Map   
            this.firstLoad = false;       
            this.setTimeline();
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

  setTimeline() {
    this.events = new Array<any>();
    let startDate;
    let endDate;
    let start_location;
    for (let i=0; i < this.allJourneys.length; i++) {
      if (this.allJourneys[i].journey_name === this.journeyName) {
        startDate = this.allJourneys[i].start;
        endDate = this.allJourneys[i].end;
        if (!this.allJourneys[i].start_location) {
          start_location = "Start Location";
        } else {
          start_location = this.allJourneys[i].start_location;
        }
        break;
      }
    }

    this.events.push({ "date": new Date(startDate), "header": start_location, "icon": "fa-plane"});
    
    for (let i=0; i < this.stops.length; i++) {
      this.events.push({ "date": new Date(this.stops[i].arrival), "header": this.stops[i].name });
    }

    this.events.push({ "date": new Date(endDate), "header": start_location, "icon": "fa-flag-checkered" });
  }

  getCurrStop () {
    return this.stops[this.activeStopIndex].name;
  }

  getStop (i:number) {
    return this.stops[i].name;
  }

  setActiveJourney(name:string) {
    if (!this.firstLoad){
      this.firstLoad = true;
    }

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
      }        
    );
    
    this.setUrls(this.getCurrStop());  // Refresh the Map
    this.setTimeline();
  }

  setActiveStop(stop:string) {
    this.firstLoad = false;
    for (let i=0; i < this.stops.length; i++) {
      if (stop === this.stops[i].name) {
        this.activeStopIndex = i;
      }
    }
    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
      res => {
          this.aboutText = res.info;
      }        
    );
    this.setUrls(this.getCurrStop());  // Refresh the Map
  }

  getJourneyLength() {
      try {
        return this.allJourneys.length;
      } catch (e) {
        return 0;
      }
  }

  setUrls(stopName:string){
    // this.weatherUrl = "https://forecast.io/embed/#lat=" + this.stops[this.activeStopIndex].lat + "&lon=" + this.stops[this.activeStopIndex].lng + "&units=uk&color=#000037";
    this.mapUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAWhdBjPKjj_DNstBfp3i65VTtCeEzucyc&q=" + stopName + " City";
    if (this.firstLoad){
      this.mapUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAWhdBjPKjj_DNstBfp3i65VTtCeEzucyc&q=" + "Planet Earth";
      this.activeStopIndex = -1; 
    }
  }

  regStop(string) {
    return string.replace(/,.*/,'');
  }

  shortAbout() {
    let sentences = this.aboutText.match(/^(.*?\..*?)\.(\s|<\/p>)/); // get first two sentences from aboutText
    if (sentences) {
      let text = sentences[0]; // only want the first match
      return text;
    } else {
      return "No information found."
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

  saveNotes() {
    // Post to backend
    this.stops[this.activeStopIndex].notes = this.newNotes;
    this.isModifyingNotes = !this.isModifyingNotes;
    this.pushNotes();
  }

  deleteNotes() {
    // TODO
    this.stops[this.activeStopIndex].notes = null;    
    this.pushNotes();
  }

  pushNotes() {
    let payload = {'jIndex': this.activeJourneyIndex,
        'sIndex': this.activeStopIndex,
        'notes': this.stops[this.activeStopIndex].notes
    };
    this.loggedInService.updateNotes(JSON.stringify(payload)).subscribe(
        (res) => {console.log("pushed to server successfully")}
    )
  }
}
