import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { LoggedInService } from '../loggedIn.service';
import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications'

@Component({
  selector: 'app-my-journeys',
  templateUrl: './my-journeys.component.html',
  styleUrls: ['../app.component.css', './my-journeys.component.css']
})
export class MyJourneysComponent implements OnInit {
  public allJourneys = [{'journey_name': 'Journey', 'stops': []}];
  public connService: ConnectionService;
  public loggedInService: LoggedInService;
  public journeyService: JourneyService;
  public modalJourney: string;
  public modalIndex: number;
  public notifysuccess: number;
  public notifyfailure: number;
  public success: number;

  constructor(_connectionService: ConnectionService, _loggedinService: LoggedInService, _journeyService: JourneyService,
      public router: Router,  private notification: NotificationsService) {
    this.connService = _connectionService;
    this.loggedInService = _loggedinService;
    this.journeyService = _journeyService;
  }

  ngOnInit() {
    if (!this.loggedInService.loggedIn()) {
      this.router.navigate(['/login']);
    }
    this.notifysuccess = 0;
    this.notifyfailure = 0;
    this.success = 0;
    this.getJourneyList();
  }

  viewJourney(i: number) {
    this.journeyService.activeJourneyIndex = i;
  }

  setModify(i: number) {
    this.router.navigate(['/modify', i]);
  }

  deleteJourney() {
      // this.notifysuccess = 0;
      // this.notifyfailure = 0;
      this.loggedInService.deleteJourney(JSON.stringify({'delete': this.modalIndex})).subscribe(
          (res) => {
            // this.router.navigate(['/my-journeys'])
            this.notifyDelete();
            this.getJourneyList();
            window.scrollTo(0,0);
            // this.notifysuccess = 1;
            console.log("Success deleting journey");
          },
          (error) => {
            // this.notifyfailure = 1;
            console.log("Could not delete");
          }
      )
  }

  getJourneyList() {
    this.connService.getProtectedData('api/get_all_journeys').subscribe(
        res => {
            if (res.journeys.length == 0) {
              // No journeys, direct them to make a journey :)
              this.notifyRedirect();
              setTimeout(() => {
                this.router.navigate(['/journey']);
              }, 500)
              return;
            }
            this.allJourneys = res.journeys;
            console.log('Success getting journeys');
        },
        (error) => {console.log(`could not connect ${error}`)}
    );
  }

  sendData(journey:string, index:number) {
    this.modalJourney = journey;
    this.modalIndex = index;
  }

  notifyDelete() {
    this.notification.success(
      this.modalJourney,
      "Journey deleted successfully",
    );
  }

  notifyRedirect() {
    this.notification.error(
      "No Existing Journeys",
      "Redirecting...",
      {
        timeOut: 2500,
        showProgressBar: true
      }
    );
  }

}
