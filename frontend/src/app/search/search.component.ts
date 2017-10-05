import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'planner-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  // The following template for search bar was obtained from: https://myangularworld.blogspot.com.au/2017/07/google-maps-places-autocomplete-using.html
  @ViewChild('search') public searchElement: ElementRef;

  public val:string = "";

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private searchService: SearchService) {}

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
    this.val = this.searchService.query;
    this.searchService.query = "";
  }
}

