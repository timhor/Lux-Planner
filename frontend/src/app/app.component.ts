import { Component } from '@angular/core';
import { SearchComponent } from './search.component'
import { DestinationComponent } from './destination.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [SearchComponent, DestinationComponent]
})
export class AppComponent {
  title = 'Holiday Planner';
}
