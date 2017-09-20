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
    console.log(myJourney);
    let handle = this.loggedInService.postJourney(myJourney);
    handle.subscribe(
        (res) => {
            // this.router.navigate(['/dashboard']);
            console.log("SUCCESS!!!");
        },
        (error) => console.log("nah fuck you.")
    )
    // Send this JSON to backend 
    // Make invalidForm = true if invalid credentials
  }

  updateVars() {
    let x = <HTMLFormElement>document.getElementById('nextStop');
    this.myStops = [];
    for (let i = 5; i < x.elements.length; i+=3) {
      let value = (<HTMLInputElement>x.elements.item(i)).value;
      console.log(value);
      if (value === "") continue;
      this.myStops.push(value);
    }
    console.log(this.myStops);
    let d = <FormArray>this.myJourneys.controls['destinations'].value;
    for (let i = 0; i < d.length; i++) {
      (<FormGroup>(<FormArray>this.myJourneys.controls['destinations']).at(i)).controls['location'].patchValue(this.myStops[i]);
    }
    console.log(this.myJourneys.value);
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
      // let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement);
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
        instance.fillDetails();
      });
    });
  }

  fillDetails() {
    let field = "initialLocation";
    console.log("ENTERED FILLED DETAILS");
    console.log(this.myJourneys.controls[field].value);
    this.myJourneys.controls[field].setValue((<HTMLInputElement>document.getElementById(field)).value);
    console.log(this.myJourneys.controls[field].value);
  }

  getStop(i) {
    this.updateVars();
    console.log("Curr Index = " + i);
    return this.myStops[i];
  }
}
