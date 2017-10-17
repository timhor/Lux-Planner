import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';

@Injectable()
export class LoggedInService {
  private server: string = !isDevMode() ? 'https://seng2021-lux-api.herokuapp.com/': 'http://localhost:5000/';
  private options: RequestOptions = new RequestOptions({
    headers: new Headers({'Content-Type': 'application/json'})
    });

  constructor(private http: Http, private authHttp: AuthHttp, private router: Router) {
  }

  public login(username: string, password: string) {
     return this.http.post(this.server + 'auth', JSON.stringify({
         'username': username,
         'password': password
        }), this.options).map((res: Response) => res.json());
  }

  public loggedIn() {
    return tokenNotExpired();
  }

  public signup(username: string, password: string, email: string, firstName: string, lastName: string) {
     return this.http.post(this.server + 'api/new_user', JSON.stringify({
        'username': username,
        'password': password,
        'email': email,
        'firstName': firstName,
        'lastName': lastName
    }), this.options).map((res: Response) => res.json());
  }

  public changeDetails(payload: object) {
    return this.authHttp.post(this.server + 'api/change_user_details/', JSON.stringify(payload),
    this.options).map((res: Response) => res.json());
  }

  public postJourney(payload: string) {
     return this.authHttp.post(this.server + 'api/new_journey', payload,
        this.options).map((res: Response) => res.json());
  }

  public deleteJourney(payload: string) {
     return this.authHttp.post(this.server + 'api/delete_journey', payload,
        this.options).map((res: Response) => res.json());
  }

  public updateNotes(payload: string) {
     return this.authHttp.post(this.server + 'api/update_notes', payload,
        this.options).map((res: Response) => res.json());
  }

  public updateItinerary(payload: string) {
     return this.authHttp.post(this.server + 'api/update_itinerary', payload,
        this.options).map((res: Response) => res.json());
  }

  public deleteAccount(payload: string) {
    return this.authHttp.post(this.server + 'api/update_itinerary', payload,
    this.options).map((res: Response) => res.json());
  }

}
