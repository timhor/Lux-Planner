import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MapsAPILoader } from '@agm/core';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {} from '@types/googlemaps';
import { StopComponent } from '../stop/stop.component';
import { SearchComponent } from '../search/search.component'
import { LoggedInService } from '../loggedIn.service';
import { ConnectionService } from '../connection.service';
import { NotificationsService } from 'angular2-notifications';
import { JourneyService } from'../journey.service';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['../app.component.css', './journey.component.css']
})
export class JourneyComponent implements OnInit {

  public myJourney: FormGroup;
  public myStops: Array<any> = [];
  public invalidForm: boolean = false;
  public invalidInfo: string = "Invalid entries: all fields are required.";
  public isLoggedIn: boolean;
  public isModifying: number = -1;
  public modifyingStops: Array<any> = [];
  public modifyingCounter: number;
  private sub:any;

  /* The time picker does not take into account different time zones, but the app's validation
     requires each successive stop to have arrival time after departure time. Technically you 
     can fly back in time, e.g. Sydney to US or UK, which would be rejected by the app. This
     adds a 26 hour time tolerance to validation. */
  private timeTolerance: number =   26  // hours
                                *   60  // minutes / hour
                                *   60  // seconds / minute
                                * 1000; // milliseconds / second 

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private fb: FormBuilder,
    private loggedInService: LoggedInService,
    public router: Router,
    private route: ActivatedRoute,
    private connectionService: ConnectionService,
    private notification: NotificationsService,
    private journeyService: JourneyService
  ) {}

  // The following template for search bar was obtained from: https://myangularworld.blogspot.com.au/2017/07/google-maps-places-autocomplete-using.html
  @ViewChild("search") public searchElement: ElementRef;

  ngOnInit() {
    this.isLoggedIn = this.loggedInService.loggedIn();
    this.getAutocomplete();
    this.sub = this.route.params.subscribe(params => {
      if(+params['id'] >= 0) {
        this.isModifying = +params['id'];
      }
    });
    this.myJourney = this.fb.group({
      journeyName: new FormControl(),
      initialLocation: new FormControl(),
      initialDeparture: new FormControl(),
      initialArrival: new FormControl(),
      destinations: this.fb.array(
        [this.buildItem('')]
      )
    })
    if (this.isModifying !== -1) {
      this.connectionService.getProtectedData('api/get_all_journeys').subscribe(
        res => {
          let journey = res.journeys[this.isModifying];
          this.myJourney = this.fb.group({
            journeyName: new FormControl(journey.journey_name),
            initialLocation: new FormControl(journey.start_location),
            initialDeparture: new FormControl(new Date(journey.start)),
            initialArrival: new FormControl(new Date(journey.end)),
            destinations: this.fb.array([])
          })
          for (let i = 0; i < journey.stops.length; i++) {
            let stop = journey.stops[i];
            (<FormArray>this.myJourney.get('destinations')).push(
              this.loadItem(stop.name, new Date(stop.departure), new Date(stop.arrival))
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
    if (this.isModifying !== -1 && this.modifyingCounter === 1) {
      let d = <FormArray>this.myJourney.controls['destinations'].value;
      for (let i = 0; i < d.length; i++) {
        let value = (<FormGroup>(<FormArray>this.myJourney.controls['destinations']).at(i)).controls['location'].value;
        if (!this.modifyingStops.includes(value) && value) {
          this.modifyingStops.push(value);
        }
      }
      let x = document.getElementsByClassName('searchComponent');
      for (let i = 0; i < x.length; i++) {
        (<HTMLInputElement>x[i].firstElementChild).value = this.modifyingStops[i];
      }
      this.modifyingCounter++;
    }
  }

  addStop(myJourney: FormGroup) {
    (<FormArray>this.myJourney.get('destinations')).push(this.buildItem(''));
  }

  submit() {
    this.updateVars();
    let payload = this.myJourney.getRawValue();

    // Check that all fields have been filled in

    if (!payload.journeyName || payload.journeyName.length === 0 || /^\s*$/.test(payload.journeyName)) {
      this.exitWithMessage("Invalid entries: please provide a <strong>Journey Name</strong>.");
      return;
    }

    if (!(payload.initialLocation && payload.initialArrival && payload.initialDeparture)) {
      this.exitWithMessage("Invalid entries: all fields are required.");
      return;
    }

    for (let i = 0; i < payload.destinations.length; i++) {
      if (!(payload.destinations[i].arrival && payload.destinations[i].departure && payload.destinations[i].location)) {
        this.exitWithMessage("Invalid entries: all fields are required.");
        return;
      }
    }

    // Check that all inputs are valid
    // 'From' corresponds to arrival because it represents the date of arriving at a destination
    // 'To' corresponds to departure because it represents the date of leaving a destination
    
    let journey_start: Date = new Date(payload.initialDeparture);
    let journey_end = new Date(payload.initialArrival);
    let curr_end = journey_start;

    if (journey_end < journey_start) {
      this.exitWithMessage("Invalid entries: <strong>Journey End Date</strong> must be after <strong>Journey Start Date</strong>.");
      return;
    }

    for (let i = 0; i < payload.destinations.length; i++) {
      let curr_arr = new Date(payload.destinations[i].arrival);
      let curr_dep = new Date(payload.destinations[i].departure);

      // If arriving at a stop before leaving the previous stop
      if (curr_arr.getTime() + this.timeTolerance < curr_end.getTime()) {
        this.exitWithMessage("Invalid entries: each stop's <strong>From</strong> date must be after the previous stop's <strong>To</strong> date.");
        return;
      }

      // If arriving at a stop before leaving (no time tolerance since same place)
      if (curr_arr.getTime() > curr_dep.getTime()) {
        this.exitWithMessage("Invalid entries: <strong>To</strong> date and time for each stop must be after <strong>From</strong> date and time.");
        return;
      }

      // If arriving at a stop after the journey has ended
      if (curr_arr.getTime() > journey_end.getTime()) {
        this.exitWithMessage("Invalid entries: <strong>From</strong> date and time for each stop must be before <strong>Journey End Date</strong>.");
        return;
      }

      curr_end = curr_dep;
    }

    // If leaving the final stop after the journey has ended
    if (curr_end.getTime() > journey_end.getTime() + this.timeTolerance) {
      this.exitWithMessage("Invalid entries: <strong>Journey End Date</strong> must be after the final stop's <strong>To</strong> date.");
      return;
    }

    this.connectionService.getProtectedData('api/get_all_journeys').subscribe(
      res => {
        if (this.isModifying !== -1) {
          this.journeyService.activeJourneyIndex = this.isModifying;
        } else {
          this.journeyService.activeJourneyIndex = res.journeys.length;
        }
      },
      (error) => {console.log(`could not connect ${error}`)}
    );

    payload.isModifying = this.isModifying;
    let myJourney = JSON.stringify(payload);
    let handle = this.loggedInService.postJourney(myJourney);
    handle.subscribe(
      (res) => {
        this.notifySuccess();
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.exitWithMessage("Error saving journey.");
        this.invalidForm = true;
        window.scrollTo(0,0);
      }
    )
  }

  exitWithMessage(msg: string) {
    this.invalidInfo = msg;
    this.invalidForm = true;
    window.scrollTo(0, 68); // scroll back to top (just under navbar) so user can see the error message
  }

  cancel() {
    this.router.navigate(['/my-journeys']);
  }

  updateVars() {
    let x = document.getElementsByClassName('searchComponent');
    this.myStops = [];
    for (let i = 0; i < x.length; i++) {
      let value = (<HTMLInputElement>x[i].firstElementChild).value;
      if (value === "") continue;
      this.myStops.push(value);
    }

    let d = <FormArray>this.myJourney.controls['destinations'].value;
    for (let i = 0; i < d.length; i++) {
      (<FormGroup>(<FormArray>this.myJourney.controls['destinations']).at(i)).controls['location'].patchValue(this.myStops[i]);
    }
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
    this.myJourney.controls['initialLocation'].setValue((<HTMLInputElement>document.getElementById(field)).value);
  }

  getStop(i) {
    this.updateVars();
    return this.myStops[i];
  }

  notifySuccess() {
    if (this.isModifying === -1) {
      this.notification.success(
        this.myJourney.controls['journeyName'].value,
        "Journey created successfully"
      )
    } else {
      this.notification.success(
        this.myJourney.controls['journeyName'].value,
        "Journey modified successfully"
      )
    }
  }
  
}
