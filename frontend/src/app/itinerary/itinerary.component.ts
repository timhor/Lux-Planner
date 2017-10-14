import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { LoggedInService } from '../loggedIn.service';
// import { EventService } from '../event.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['../app.component.css', './itinerary.component.css']
})

// Some of the script below was obtained from: http://primefaces.org/primeng/#/schedule, and modified according to our needs
export class ItineraryComponent implements OnInit {
  public stops: string[] = ['Tokyo', 'Hong Kong', 'Singapore'];
  public journeyIndex: number;
  public stopIndex: number;  
  public currStop: number;

  events: any[];
  header: any;
  event: MyEvent;
  dialogVisible: boolean = false;
  idGen: number = 100;

  constructor(
      private cd: ChangeDetectorRef,
      private connService: ConnectionService,
      private loggedInService: LoggedInService
    ) {}

  ngOnInit() {
    //TODO: Replace with dynamically populated events array from database
    this.events = []
    // this.events = [
    // 	{
    //     "id": 1,
    // 		"title": "All Day Event",
    // 		"start": "2017-10-01"
    // 	},
    // 	{
    //     "id": 2,
    // 		"title": "Long Event",
    // 		"start": "2017-10-07",
    // 		"end": "2017-10-10"
    // 	},
    // 	{
    // 		"id": 3,
    // 		"title": "Repeating Event",
    // 		"start": "2017-10-09"
    // 	},
    // 	{
    // 		"id": 4,
    // 		"title": "Repeating Event",
    // 		"start": "2017-10-16"
    // 	},
    // 	{
    //     "id": 5,
    // 		"title": "Conference",
    // 		"start": "2017-10-11",
    // 		"end": "2017-10-13"
    // 	},
    // 	{
    //     "id": 6,
    // 		"title": "Meeting",
    // 		"start": "2017-10-12",
    // 		"end": "2017-10-12"
    // 	},
    // 	{
    //     "id": 7,
    // 		"title": "Lunch",
    // 		"start": "2017-10-12"
    // 	},
    // 	{
    //     "id": 8,
    // 		"title": "Meeting",
    // 		"start": "2017-10-12"
    // 	},
    // 	{
    //     "id": 9,
    // 		"title": "Happy Hour",
    // 		"start": "2017-10-12"
    // 	},
    // 	{
    //     "id": 10,
    // 		"title": "Dinner",
    // 		"start": "2017-10-12"
    // 	},
    // 	{
    //     "id": 11,
    // 		"title": "Birthday Party",
    // 		"start": "2017-10-13"
    // 	},
    // 	{
    //     "id": 12,
    // 		"title": "Click for Google",
    // 		"url": "http://google.com/",
    // 		"start": "2017-10-28"
    // 	}
    // ];
    
    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
  }

  handleDayClick(event) {
      this.event = new MyEvent();
      this.event.start = event.date.format();
      this.dialogVisible = true;
      
      //trigger detection manually as somehow only moving the mouse quickly after click triggers the automatic detection
      this.cd.detectChanges();
  }

  handleEventClick(e) {
      this.event = new MyEvent();
      this.event.title = e.calEvent.title;
      
      let start = e.calEvent.start;
      let end = e.calEvent.end;
      if(e.view.name === 'month') {
          start.stripTime();
      }
      
      if(end) {
          end.stripTime();
          this.event.end = end.format();
      }

      this.event.id = e.calEvent.id;
      this.event.start = start.format();
      this.event.allDay = e.calEvent.allDay;
      this.dialogVisible = true;
  }

  saveEvent() {
      //update
      if(this.event.id) {
          let index: number = this.findEventIndexById(this.event.id);
          if(index >= 0) {
              this.events[index] = this.event;
          }
      }
      //new
      else {
          this.event.id = this.idGen++;
          console.log(this.events.length);                    
          this.events.push(this.event);
          console.log(this.events.length);          
          this.event = null;
      }
      this.dialogVisible = false;
      
      //TODO: Update data in database
      this.updateBackend();

  }

  deleteEvent() {
      let index: number = this.findEventIndexById(this.event.id);
      if(index >= 0) {
          this.events.splice(index, 1);
      }
      this.dialogVisible = false;

      //TODO: Update data in database
      this.updateBackend();
      
  }

  findEventIndexById(id: number) {
      let index = -1;
      for(let i = 0; i < this.events.length; i++) {
          if(id == this.events[i].id) {
              index = i;
              break;
          }
      }
      
      return index;
  }

  public visible = false;
  public visibleAnimate = false;

  public show(journeyIndex: number, stopIndex: number, stop: number): void {
    document.documentElement.setAttribute('style', 'overflow-y: hidden; margin-right:17px;');
    this.journeyIndex = journeyIndex;
    this.stopIndex = stopIndex;    
    this.currStop = stop;
    this.connService.getProtectedData(`api/get_itinerary/?journey=${this.journeyIndex}&stop=${this.stopIndex}`)
        .subscribe(res => {this.events = res});
    console.log(this.journeyIndex, this.stopIndex, this.currStop);
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    document.documentElement.setAttribute('style', 'overflow-y: scroll');
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  private updateBackend() {
    this.loggedInService.updateItinerary(JSON.stringify({
        'journey': this.journeyIndex,
        'stop': this.stopIndex,
        'events': this.events
    })).subscribe();
  }
}

export class MyEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  allDay: boolean = true;
}