import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.css']
})
export class ItineraryComponent implements OnInit {
  public stops: string[] = ['Tokyo', 'Hong Kong', 'Singapore'];
  
  constructor() { }

  ngOnInit() {
  }

}
