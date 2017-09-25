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
  public invalidForm:boolean = false;
  public isLoggedIn;
  public isModifying:boolean = false;
  
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
    this.modifyJourneyService.isModifying = false;
    this.myJourneys = this.fb.group({
      journeyName: new FormControl(),
      initialLocation: new FormControl(),
      initialDeparture: new FormControl(),
      initialArrival: new FormControl(),
      destinations: this.fb.array(
        [this.buildItem('')]
      )
    })
    if (this.isModifying) {
      this.connectionService.getProtectedData('api/get_all_journeys').subscribe(
        res => {
          let journey = res.journeys[this.modifyJourneyService.journeyIndex];
          this.myJourneys = this.fb.group({
            journeyName: new FormControl(journey.journey_name),
            initialLocation: new FormControl(journey.start_location),
            initialDeparture: new FormControl(this.transformDate(journey.start)),
            initialArrival: new FormControl(this.transformDate(journey.end)),
            destinations: this.fb.array([])
          })
          for (let i = 0; i < journey.stops.length; i++) {
            let stop = journey.stops[i];
            (<FormArray>this.myJourneys.get('destinations')).push(
              this.loadItem(stop.name, this.transformDate(stop.arrival), this.transformDate(stop.departure))
            );
          }  
        },
        (error) => {console.log(`could not connect ${error}`)}
      ); 
    }
  }
  
  submit() {
    this.updateVars();
    let payload = this.myJourneys.getRawValue();
    console.log(payload);
    let journey_start: Date = new Date(payload.initialDeparture);
    // console.log(journey_start.getTime());
    let journey_end = new Date(payload.initialArrival);
    let curr_end = journey_start;
    // payload.destinations.forEach(dest => {
    //     let curr_arr = new Date(dest.arrival);
    //     let curr_dep = new Date(dest.departure);

    //     if (curr_arr.getTime() < curr_end.getTime()) {
    //         // Tell the user error
    //         console.log("Bad arrival time");
    //         return;
    //     }
    //     if (curr_arr.getTime() > curr_dep.getTime()) {
    //         console.log("Bad depature time");
    //         return;
    //     }
    //     curr_end = curr_dep;
    // });

    for (var i = 0; i < payload.destinations.length; i++) {
        let curr_arr = new Date(payload.destinations[i].arrival);
        let curr_dep = new Date(payload.destinations[i].departure);

        if (curr_arr.getTime() < curr_end.getTime()) {
            // Tell the user error
            console.log(`Bad arrival time ${curr_arr.getTime()} vs ${curr_end.getTime()}`);
            this.invalidForm = true;
            return;
        }
        if (curr_arr.getTime() < curr_dep.getTime()) {
            console.log(`Bad depature time ${curr_arr.getTime()} vs ${curr_dep.getTime()}`);
            this.invalidForm = true;            
            return;
        }
        curr_end = curr_dep;
    }
    if (curr_end.getTime() > journey_end.getTime()) {
        console.log(`Bad finish time ${curr_end.getTime()} vs ${journey_end.getTime()}`);
        this.invalidForm = true;        
        return;
    }
    
    
    let myJourney = JSON.stringify(this.myJourneys.getRawValue());
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

  transformDate(date) {
    return new Date(date).toISOString().slice(0,10);
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
