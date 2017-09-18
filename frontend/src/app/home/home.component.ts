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
  constructor(private searchService: SearchService) {}

  ngOnInit() {
    let mainSearchBar = <HTMLInputElement>document.getElementById("mainSearch").children[0];
    mainSearchBar.placeholder = "Search for location..."
  }

  sendQuery() {
    console.log((<HTMLInputElement>document.getElementById("mainSearch")).value);
    this.searchService.query =(<HTMLInputElement>document.getElementById("mainSearch")).value;
  }
}

