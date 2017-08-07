import { Component } from '@angular/core';
import { SearchComponent } from './search.component'
import { FriendComponent } from './friend.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [SearchComponent, FriendComponent]
})
export class AppComponent {
  title = 'Holiday Planner';
}
