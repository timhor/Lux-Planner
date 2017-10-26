import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
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
  public modalJourney: string;
  public modalIndex: number;
  public notifysuccess: number;
  public notifyfailure: number;
  public success: number;
  public isLoading: boolean = true;

  constructor(
    private connService: ConnectionService,
    private loggedInService: LoggedInService,
    private journeyService: JourneyService,
    public router: Router,
    private notification: NotificationsService
  ) {}

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

      this.loggedInService.deleteJourney(JSON.stringify({'delete': this.modalIndex})).subscribe(
          (res) => {
            this.notifyDelete();
            this.getJourneyList();
          },
          (error) => {
            console.log("Could not delete");
          }
      )
  }

  getJourneyList() {
    this.connService.getProtectedData('api/get_all_journeys').subscribe(
        res => {
            if (res.journeys.length == 0) {
              // No journeys, direct them to make a journey
              this.notifyRedirect();
              setTimeout(() => {
                this.router.navigate(['/journey']);
              }, 500)
              return;
            }
            this.allJourneys = res.journeys;
            this.isLoading = false;
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
