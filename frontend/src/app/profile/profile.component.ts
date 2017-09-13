import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public avatar;
  public username;
  public email;
  public dateJoined;
  public journeys;
  constructor() { }

  ngOnInit() {
    //fetch account details from backend
    //TODO: replace literals with details
    this.avatar = "https://dummyimage.com/250x250/000/fff";
    this.username = "Username";
    this.email = "userEmail@mail.com";
    this.dateJoined = "dd/mm/yyyy";
    this.journeys = ['Journey1', 'Journey2', 'Journey3'];
  }

}
