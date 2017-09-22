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

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['../app.component.css', './journey.component.css']
})
export class JourneyComponent implements OnInit {

  public myJourneys: FormGroup;
  public myStops = [];
  public invalidForm:boolean = false;;
  public isLoggedIn;

  
  constructor(
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone,
    private fb: FormBuilder,
    private loggedInService: LoggedInService,
    public router: Router
  ) {}

  // The following template for search bar was obtained from: https://myangularworld.blogspot.com.au/2017/07/google-maps-places-autocomplete-using.html
  @ViewChild("search") public searchElement: ElementRef;

  ngOnInit() {
    // build the form model
    this.myJourneys = this.fb.group({
      journeyName: new FormControl(),
      initialLocation: new FormControl(),
      initialDeparture: new FormControl(),
      initialArrival: new FormControl(),
      destinations: this.fb.array(
        [this.buildItem('')]
      )
    })
    this.isLoggedIn = this.loggedInService.loggedIn();
    this.getAutocomplete();
  }
  
  submit() {
    this.updateVars();
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
