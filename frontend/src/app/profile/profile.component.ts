import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public avatar;
  public username;
  public email;
  public firstName;
  public lastName;
  public gender;
  public dateJoined = "19/09/2017";
  public journeys: string[] = ['Journey1', 'Journey2'];
  public connService: ConnectionService;

  constructor( _connectionService: ConnectionService) { 
    this.connService = _connectionService;

    this.connService.getProtectedData('api/get_account_details/').subscribe(
        res => {
          this.username = res.username;
          this.email = res.email;
          this.firstName = res.first_name;
          this.lastName = res.last_name;
          this.gender = res.gender;
          console.log('Success getting account details');   
        },
        (error) => {console.log(`could not connect ${error}`)}
    );
   /* this.connService.getProtectedData('api/get_all_journeys').subscribe(
      res => {
          this.journeys = res.journeys;
          console.log('Success getting journeys');
          console.log(this.journeys)
        },
        (error) => {console.log(`could not connect ${error}`)}
    );*/

  }

  ngOnInit() {
    //fetch account details from backend
    //TODO: replace literals with details
   // this.avatar = "https://dummyimage.com/250x250/000000/baffef&text=No+Image+Available";
    //this.username = "Username";
    //this.email = "userEmail@mail.com";
    //this.dateJoined = "dd/mm/yyyy";
    //this.journeys = ['Journey1', 'Journey2', 'Journey3'];
  }

}
