import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { SearchService } from '../search.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent {

  // The following template for search bar was obtained from: https://myangularworld.blogspot.com.au/2017/07/google-maps-places-autocomplete-using.html
  @ViewChild('search') public searchElement: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, 
    private searchService: SearchService) {}

  ngOnInit() {
    this.mapsAPILoader.load().then(
      () => {
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
      }
    );
  }

  sendQuery() {
    console.log((<HTMLInputElement>document.getElementById("mainSearch")).value);
    this.searchService.query =(<HTMLInputElement>document.getElementById("mainSearch")).value;
  }
}

