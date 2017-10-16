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
  idGen: number;

  constructor( private cd: ChangeDetectorRef, private connService: ConnectionService, private loggedInService: LoggedInService) {
  }

  ngOnInit() {
    this.events = []
    
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
      
      this.updateBackend();

  }

  deleteEvent() {
      let index: number = this.findEventIndexById(this.event.id);
      if(index >= 0) {
          this.events.splice(index, 1);
      }
      this.dialogVisible = false;

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
    document.documentElement.setAttribute('style', 'overflow-y: hidden;');
    document.getElementsByClassName('navbar-right')[0].setAttribute('style', 'margin-right: 17px;');
    // "wrap" class is used for the main body of the page (between navbar and footer)
    document.getElementById('wrap').setAttribute('style', 'margin-right: 17px;');
    this.journeyIndex = journeyIndex;
    this.stopIndex = stopIndex;    
    this.currStop = stop;
    this.connService.getProtectedData(`api/get_itinerary/?journey=${this.journeyIndex}&stop=${this.stopIndex}`)
        .subscribe(res => {this.events = res});

    if (this.events.length > 0) {
        this.idGen = Math.max.apply(this, this.events.map(function(o){return o.id;}));
    } else {
        this.idGen = 0;
    }

    console.log(this.journeyIndex, this.stopIndex, this.currStop);
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    document.documentElement.setAttribute('style', 'overflow-y: scroll');
    document.getElementsByClassName('navbar-right')[0].setAttribute('style', 'margin-right: 0;');
    document.getElementById('wrap').setAttribute('style', 'margin-right: 0;');
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