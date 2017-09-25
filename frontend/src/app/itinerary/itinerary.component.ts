import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['../app.component.css', './itinerary.component.css']
})
export class ItineraryComponent implements OnInit {
  public stops: string[] = ['Tokyo', 'Hong Kong', 'Singapore'];
  public currStop;

  events: any[];

  constructor() { 

  }

  ngOnInit() {
    this.events = [
      {
          "title": "All Day Event",
          "start": "2017-09-25"
      },
      {
          "title": "All Day Event",
          "start": "2017-09-25"
      },
      {
          "title": "All Day Event",
          "start": "2017-09-25"
      },
      {
          "title": "All Day Event",
          "start": "2017-09-25"
      },
      {
          "title": "All Day Event",
          "start": "2017-09-25"
      },
    ];
  }

  public visible = false;
  public visibleAnimate = false;

  public show(val): void {
    this.currStop = val;
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
}
