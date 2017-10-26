import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StopComponent } from '../stop/stop.component';
import { ItineraryComponent } from '../itinerary/itinerary.component';
import { ConnectionService } from '../connection.service';
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
  private isModifyingNotes = false;
  private newNotes: string = "";
  private bounds;
  public startingLocationName: string;
  settings: WeatherSettings;
  public isLoading: boolean = true;
  events: any[];
  header: any;
  public calendarOptions: any;
  public quickEditActive: boolean = false;
  public notesOptions: any;
  public newArrival: Date;
  public newDeparture: Date;
  public startDate: Date;

  constructor(
    private connService: ConnectionService,
    private loggedInService: LoggedInService,
    private journeyService: JourneyService,
    private notification: NotificationsService,
    private mapsAPILoader: MapsAPILoader,
    public sanitizer: DomSanitizer,
    public router: Router
  ) {

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
            this.activeJourneyIndex = this.journeyService.activeJourneyIndex;
            this.allJourneys = res.journeys;
            this.journeyName = res.journeys[this.activeJourneyIndex].journey_name;
            this.checkForOverview();  // Check if current page is overview
            this.firstLoad = false;
            this.updateMap();
            this.setActiveJourney(this.activeJourneyIndex);
            this.isLoading = false;
            setTimeout(() => {
              this.setTimelineWidth();
            },1);
        },
        (error) => {console.log(`could not connect ${error}`)}
    );
  }

  ngOnInit() {
    if (!this.loggedInService.loggedIn()) {
      this.router.navigate(['/login']);
    }

    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listMonth'
    };
    this.notesOptions = {
      height: '200px',
      toolbarButtons: 	['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|',
                         'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink',
                         'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'specialCharacters',
                         'insertHR', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|',
                         'undo', 'redo'],
      events : {
        'froalaEditor.initialized' : function(e, editor) {
          editor.events.focus(true);
        },
      }
    }
  }

  getCurrStop () {
    return this.stops[this.activeStopIndex].name;
  }

  getStop (i:number) {
    return this.stops[i].name;
  }

  setActiveJourney(index:number) {
    if (!this.firstLoad) {
      this.firstLoad = true;
    }

    this.activeJourneyIndex = index;

    let journey = this.allJourneys[this.activeJourneyIndex];
    this.journeyName = journey.journey_name
    this.stops = journey.stops;
    this.activeStopIndex = 0;
    this.startingLocationName = journey.start_location;

    this.checkForOverview();  // Check if current page is overview
    this.updateMap();
    if (!this.isLoading) {
      this.setTimelineWidth();
    }
    this.refreshCalendar();
    this.calendarOptions = {
      startDate: this.allJourneys[this.activeJourneyIndex].start,
      endDate: this.allJourneys[this.activeJourneyIndex].end,
      defaultDate: new Date(this.allJourneys[this.activeJourneyIndex].start),
      dayRender: function(date, cell) {
        let start = new Date(this.options.startDate);
        let end = new Date(this.options.endDate);
        let curr = new Date(date._d)
        let today = new Date()
        if (!(curr.getDate() >= start.getDate() && curr.getDate() < end.getDate()
            && curr.getMonth() >= start.getMonth() && curr.getMonth() <= end.getMonth()
            && curr.getFullYear() >= start.getFullYear() && curr.getFullYear() <= end.getFullYear()
            || (curr.getDate() === today.getDate() && curr.getMonth() === today.getMonth() 
            && curr.getFullYear() === today.getFullYear()))) {
          cell[0].style.backgroundColor = "#DCDCDC";
        }
      },
      nowIndicator: true
    }
    this.startDate = new Date(this.allJourneys[this.activeJourneyIndex].start);
  }

  refreshCalendar() {
      this.events = [];
      let colours = ["#3498DB", "#66BB6A", "#FFC300", "#FF5733"];
      let colourIndex = 0;
      for (let i = 0; i < this.stops.length; i++) {
          this.connService.getProtectedData(`api/get_itinerary/?journey=${this.activeJourneyIndex}&stop=${i}`)
              .subscribe(res => {
                  res.forEach(event => {
                      event.title = '[' + this.stops[i].name.substring(0, 3) + '] ' + event.title;
                      event.color = colours[colourIndex];
                  });
                  this.events = this.events.concat(res);
                  colourIndex = (colourIndex + 1)%4;
              });
      }
  }

  setActiveStop(index:number) {
    this.firstLoad = false;
    this.activeStopIndex = index;

    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
      res => {
          this.aboutText = res.info;
      }
    );
    this.checkForOverview();  // Check if current page is overview
    this.updateMap();
    this.settings = {
      location: {
        latLng:{
          lat: this.stops[this.activeStopIndex].lat,
          lng: this.stops[this.activeStopIndex].lng
        }
      },
      backgroundColor: 'transparent',
      color: '#424242',
      width: '100%',
      height: '130px',
      showWind: false,
      scale: TemperatureScale.CELCIUS,
      forecastMode: ForecastMode.GRID,
      showDetails: false,
      showForecast: true,
      layout: WeatherLayout.WIDE,
      language: 'en'
    };
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
    // get first two sentences from aboutText
    let sentences = this.aboutText.match(/.*?\.[^\d]/g);
    if (sentences) {
      // regex replace is to account for numbers with decimal in the text
      // e.g. "around 7.2 million" in the aboutText for Hong Kong
      let text = sentences[0].replace(/<$/, "");
      if (sentences.length > 1) {
        text += sentences[1].replace(/<$/, "");
      }
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
    if (this.stops[this.activeStopIndex].notes === this.newNotes) {
      this.isModifyingNotes = !this.isModifyingNotes;
      this.notification.warn(
        "Notes unchanged",
        "Notes were not saved"
      )
      return;
    }
    this.stops[this.activeStopIndex].notes = this.newNotes;
    this.isModifyingNotes = !this.isModifyingNotes;
    this.pushNotes("updated");
  }

  deleteNotes() {
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

  convertDate(date) {
    return new Date(date).toLocaleDateString();
  }

  getDuration(end, start) {
    let diff = Math.abs(new Date(end).valueOf() - new Date(start).valueOf());
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays;
  }

  setActiveButton(index:number) {
    for (let i = 0; i < this.stops.length; i++) {
      document.getElementById('stopButton'+i.toString()).setAttribute('class', 'btn-circle');
    }
    if (index !== -1) {
      document.getElementById('stopButton' + index.toString()).setAttribute('class', 'btn-circle activeBtn');
    }

  }

  setTimelineWidth() {
    let element: HTMLElement = document.getElementById('timeline-line');
    let timelineWidth = Math.round((window.screen.width*0.041)*2*(this.stops.length+2)) + 30*(this.stops.length+2);
    if (timelineWidth > 0.8*window.screen.width) {
      timelineWidth = (timelineWidth/window.screen.width) * 100;
      element.setAttribute('style', "width: " + timelineWidth + "vw");
    } else {
     element.setAttribute('style', "width: 100%");
    }
  }

  toggleQuickEdit() {
    this.quickEditActive = !this.quickEditActive;
  }

  saveQuickEdit() {
    // console.log((<HTMLInputElement>document.getElementById('newLocation').children[0]).value);
    // console.log(this.newArrival);
    // console.log(this.newDeparture);
    let location = (<HTMLInputElement>document.getElementById('newLocation').children[0]).value;
    if (location === '' || location == null || this.newArrival == null || this.newDeparture == null) return;
    
    this.loggedInService.appendStop(this.activeJourneyIndex, location, this.newArrival, this.newDeparture).subscribe(
        res => {
            this.connService.getProtectedData('api/get_all_journeys').subscribe(
                res => {
                    this.allJourneys = res.journeys;
                    this.journeyName = res.journeys[this.activeJourneyIndex].journey_name;
                    this.setActiveJourney(this.activeJourneyIndex);
                    this.toggleQuickEdit();
                },
                (error) => {console.log(`could not connect ${error}`)}
            );
        }
    );
  }
}
