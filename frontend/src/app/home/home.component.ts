import { Component } from '@angular/core';
import { SearchComponent } from '../search/search.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  entryComponents: [SearchComponent]
})
export class HomeComponent {}
