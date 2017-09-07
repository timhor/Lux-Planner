import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public currJourney = "Journey 1";
  public stops: string[] = ['Tokyo', 'Hong Kong', 'Singapore'];
  constructor() {}

  ngOnInit() {
  }

}