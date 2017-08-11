import { Component } from '@angular/core';
import { Services } from '../services';

@Component({
  selector: 'michael-test',
  templateUrl: './michael.component.html',
  styleUrls: ['./app.component.css'],
})
export class MichaelComponent {
  title = 'Whatever m8';

  constructor() {}

  public getData() {
  	console.log("Hello");
  }
}
