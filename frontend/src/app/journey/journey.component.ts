import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl,
  FormGroup, Validators } from '@angular/forms'
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { StopComponent } from '../stop/stop.component';
import { SearchService } from '../search.service'
import { SearchComponent } from '../search/search.component'

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyComponent implements OnInit {

  myJourneys: FormGroup;
  
  constructor(
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone,
    private fb: FormBuilder,
    private searchService: SearchService
  ) {}

  // The following template for search bar was obtained from: https://myangularworld.blogspot.com.au/2017/07/google-maps-places-autocomplete-using.html
  @ViewChild("search") public searchElement: ElementRef;

  ngOnInit() {
    // build the form model
    this.myJourneys = this.fb.group({
      initialLocation: new FormControl(this.searchService.query),
      initialDeparture: new FormControl(),
      initialArrival: new FormControl(),
      destinations: this.fb.array(
        [this.buildItem('')]
      )
    })

    this.getAutocomplete();
  }
  
  submit() {
    console.log("Reactive Form submitted: ", this.myJourneys)
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

  getPlace (id) { 
    return (<HTMLInputElement>document.getElementById(id)).value;
  }

  fillDetails() {
    //for (
      let field = "initialLocation";// in this.myJourneys.value) {
      console.log("ENTERED FILLED DETAILS");
      console.log(field);
      console.log((<HTMLInputElement>document.getElementById(field)).value);
      console.log(this.myJourneys.controls[field].value);
      this.myJourneys.controls[field].setValue(this.getPlace(field));
      console.log(this.myJourneys.controls[field].value);
    //}
  }
}
