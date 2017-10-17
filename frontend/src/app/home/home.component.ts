import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { SearchService } from '../search/search.service'
import { ConnectionService } from '../connection.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent {
  constructor(private searchService: SearchService, private connService: ConnectionService) {
    this.connService.getServiceData('api/stop_information').subscribe();
  }

  ngOnInit() {
    let mainSearchBar = <HTMLInputElement>document.getElementById("mainSearch").children[0];
    mainSearchBar.placeholder = "Search for location..."
  }

  sendQuery() {
    this.searchService.query = (<HTMLInputElement>(<HTMLElement>document.getElementById("mainSearch")).firstElementChild).value;
  }
}

