import { Injectable } from '@angular/core';

@Injectable()
export class LoggedInService {
  public loggedIn:boolean = false;

  constructor() {
      if (localStorage['id_token']) {
          this.loggedIn = true;
      }
  }

}
