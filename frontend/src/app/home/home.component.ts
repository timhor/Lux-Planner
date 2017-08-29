import { Component } from '@angular/core';
import { SearchComponent } from '../search/search.component'
import { DestinationComponent } from '../destination/destination.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  entryComponents: [SearchComponent, DestinationComponent]
})
export class HomeComponent {
  title = 'LUX: Holiday Planner';
}
