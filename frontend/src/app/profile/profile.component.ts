import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { LoggedInService } from '../loggedIn.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public avatar: string;
  public username: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public dateJoined: string = "19/09/2017";
  public journeys; // I think this is an Array<any>?


  constructor(
    private connService: ConnectionService,
    private loggedInService: LoggedInService,
    public router: Router
  ) {

    this.connService.getProtectedData('api/get_account_details/').subscribe(
        res => {
          this.username = res.username;
          this.email = res.email;
          this.firstName = res.first_name;
          this.lastName = res.last_name;
        },
        (error) => {console.log(`could not connect ${error}`)}
    );
    this.connService.getProtectedData('api/get_all_journey_names/').subscribe(
      res => {
          this.journeys = res.names;
        },
        (error) => {console.log(`could not connect ${error}`)}
    );

  }

  ngOnInit() {
    if (!this.loggedInService.loggedIn()) {
      this.router.navigate(['/login']);
    }
    //fetch account details from backend
    //TODO: replace literals with details
   // this.avatar = "https://dummyimage.com/250x250/000000/baffef&text=No+Image+Available";
    //this.username = "Username";
    //this.email = "userEmail@mail.com";
    //this.dateJoined = "dd/mm/yyyy";
    //this.journeys = ['Journey1', 'Journey2', 'Journey3'];
  }

}
