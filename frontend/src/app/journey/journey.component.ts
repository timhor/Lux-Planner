import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl,
         FormGroup, Validators } from '@angular/forms'
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { StopComponent } from '../stop/stop.component';
import { SearchComponent } from '../search/search.component'
import { LoggedInService } from '../loggedIn.service';
import { Router } from '@angular/router';
import { ModifyJourneyService } from '../modify-journey.service';
import { ConnectionService } from '../connection/connection.service';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['../app.component.css', './journey.component.css']
})
export class JourneyComponent implements OnInit {

  public myJourneys: FormGroup;
  public myStops = [];
  public invalidForm: boolean = false;
  public isLoggedIn;
//   public isModifying: boolean = false;
  public isModifying = -1;
  public modifyingStops = [];
  public modifyingCounter;

  constructor(
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone,
    private fb: FormBuilder,
    private loggedInService: LoggedInService,
    public router: Router,
    private modifyJourneyService: ModifyJourneyService,
    private connectionService: ConnectionService
  ) {}

  // The following template for search bar was obtained from: https://myangularworld.blogspot.com.au/2017/07/google-maps-places-autocomplete-using.html
  @ViewChild("search") public searchElement: ElementRef;

  ngOnInit() {
    this.isLoggedIn = this.loggedInService.loggedIn();
    this.getAutocomplete();
    this.isModifying = this.modifyJourneyService.isModifying;
    this.modifyJourneyService.isModifying = -1;
    this.myJourneys = this.fb.group({
      journeyName: new FormControl(),
      initialLocation: new FormControl(),
      initialDeparture: new FormControl(),
      initialArrival: new FormControl(),
      destinations: this.fb.array(
        [this.buildItem('')]
      )
    })
    if (this.isModifying != -1) {
      this.connectionService.getProtectedData('api/get_all_journeys').subscribe(
        res => {
            console.log(this.isModifying);
          let journey = res.journeys[this.isModifying];
          this.myJourneys = this.fb.group({
            journeyName: new FormControl(journey.journey_name),
            initialLocation: new FormControl(journey.start_location),
            initialDeparture: new FormControl(new Date(journey.start)),
            initialArrival: new FormControl(new Date(journey.end)),
            destinations: this.fb.array([])
          })
          for (let i = 0; i < journey.stops.length; i++) {
            let stop = journey.stops[i];
            (<FormArray>this.myJourneys.get('destinations')).push(
              this.loadItem(stop.name, new Date(stop.arrival), new Date(stop.departure))
            );
          }
          this.modifyingCounter = 0;
        },
        (error) => {console.log(`could not connect ${error}`)}
      ); 
    }
  }

  ngAfterViewChecked() {
    if (this.modifyingCounter === 0) {
      this.modifyingCounter++;
      return;
    }
    if (this.isModifying != -1 && this.modifyingCounter < 2) {
      let d = <FormArray>this.myJourneys.controls['destinations'].value;
      for (let i = 0; i < d.length; i++) {
        let value = (<FormGroup>(<FormArray>this.myJourneys.controls['destinations']).at(i)).controls['location'].value;
        if (!this.modifyingStops.includes(value) && value) {
          this.modifyingStops.push(value);
        }
      }
      let x = document.getElementsByClassName('searchComponent');
      console.log(x.length);
      for (let i = 0; i < x.length; i++) {
        (<HTMLInputElement>x[i].firstElementChild).value = this.modifyingStops[i];
      }
      this.modifyingCounter++;
    }  
  }
  
  submit() {
    this.updateVars();
    let payload = this.myJourneys.getRawValue();
    console.log(payload);
    let journey_start: Date = new Date(payload.initialDeparture);
    let journey_end = new Date(payload.initialArrival);
    let curr_end = journey_start;

    for (var i = 0; i < payload.destinations.length; i++) {
        let curr_arr = new Date(payload.destinations[i].arrival);
        let curr_dep = new Date(payload.destinations[i].departure);

        // If arriving here before leaving last place
        if (curr_arr.getTime() < curr_end.getTime()) {
            // Tell the user error
            console.log(`Bad arrival date ${curr_arr.getTime()} < ${curr_end.getTime()}`);
            this.invalidForm = true;
            return;
        }

        // If this arrival happens before you leave
        if (curr_arr.getTime() > curr_dep.getTime()) {
            console.log(`Bad depature date ${curr_arr.getTime()} > ${curr_dep.getTime()}`);
            this.invalidForm = true;            
            return;
        }
        curr_end = curr_dep;
    }

    // If last dest ends after the journey end
    if (curr_end.getTime() > journey_end.getTime()) {
        console.log(`Bad finish date ${curr_end.getTime()} > ${journey_end.getTime()}`);
        this.invalidForm = true;        
        return;
    }
    
    payload.isModifying = this.isModifying;
    let myJourney = JSON.stringify(payload);
    let handle = this.loggedInService.postJourney(myJourney);
    handle.subscribe(
        (res) => {
            console.log("SUCCESS!!!");
            this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.log("Unable to save journey")
          this.invalidForm = !this.invalidForm;
        }
    )
  }

  updateVars() {
    let x = document.getElementsByClassName('searchComponent');
    this.myStops = [];
    for (let i = 0; i < x.length; i++) {
      let value = (<HTMLInputElement>x[i].firstElementChild).value;
      if (value === "") continue;
      this.myStops.push(value);
    }

    let d = <FormArray>this.myJourneys.controls['destinations'].value;
    for (let i = 0; i < d.length; i++) {
      (<FormGroup>(<FormArray>this.myJourneys.controls['destinations']).at(i)).controls['location'].patchValue(this.myStops[i]);
    }
    console.log("Form variables Updated!")
  }

  buildItem(val: string) {
    return new FormGroup({
      location: new FormControl(val, Validators.required),
      departure: new FormControl(),
      arrival: new FormControl()
    })
  }

  loadItem(loc, start, end) {
    return new FormGroup({
      location: new FormControl(loc),
      departure: new FormControl(start),
      arrival: new FormControl(end)
    })
  }

  private getAutocomplete() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
        types: ['(cities)']
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
        });
      });
      let instance = this;
      autocomplete.addListener("place_changed", function() {
        instance.saveInitialLocation();
      });
    });
  }

  saveInitialLocation() {
    let field = "initialLocation";
    this.myJourneys.controls['initialLocation'].setValue((<HTMLInputElement>document.getElementById(field)).value);
    console.log("Start Location Saved!");
  }

  getStop(i) {
    this.updateVars();
    return this.myStops[i];
  }
}
