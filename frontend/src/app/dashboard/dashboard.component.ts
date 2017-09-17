import { Component, OnInit } from '@angular/core';
import { StopComponent } from '../stop/stop.component'
import { ConnectionService } from '../connection/connection.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public currJourney = "Journey 1";
  public stops: string[] = ['Tokyo', 'Hong Kong', 'Singapore'];
<<<<<<< HEAD
  public activeIndex = 0;
  constructor() {}
=======
  public aboutText: string = "Loading Information...";
  public connService: ConnectionService;
  public scrollx;
  public scrolly;

  constructor( _connectionService: ConnectionService) {
    this.connService = _connectionService;
    this.connService.getServiceData('api/stop_information/?stop='+ this.getCurrStop()).subscribe(
      res => {
          this.aboutText = res.info; 
          console.log("About text is " + this.aboutText);   
      }        
  );
  }
>>>>>>> 338bcde20436cb19a6cc72120bdeecead65b7a2a

  ngOnInit() {
  }

  getCurrStop () {
    //temporarily. Should something check which is active
    return this.stops[0];
  }

}

