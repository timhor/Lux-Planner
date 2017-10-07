import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp, JwtHelper } from 'angular2-jwt';

@Injectable()
export class LoggedInService {
  private server: string = !isDevMode() ? 'https://seng2021-lux-api.herokuapp.com/': 'http://localhost:5000/';

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  public login(username: String, password: String) {
    let options: RequestOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'})
    });
     return this.http.post(this.server + 'auth', JSON.stringify({'username': username, 'password': password}),
        options).map((res: Response) => res.json());
  }

  public loggedIn() {
        if (localStorage['id_token'])
            return true;

        return false;
  }

  public signup(username: string, password: string, email: string, firstName: string, lastName: string) {

    let options: RequestOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'})
    });
     return this.http.post(this.server + 'api/new_user', JSON.stringify({'username': username,
        'password': password, 'email': email, 'firstName': firstName, 'lastName': lastName}),
        options).map((res: Response) => res.json());
  }

  public changeDetails(payload: object) {
    let options: RequestOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'})
    });
    return this.authHttp.post(this.server + 'api/change_user_details/', JSON.stringify(payload),
    options).map((res: Response) => res.json());
  }

  public postJourney(payload: string) {
    let options: RequestOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'})
    });
     return this.authHttp.post(this.server + 'api/new_journey', payload,
        options).map((res: Response) => res.json());
  }

  public deleteJourney(payload: string) {
    let options: RequestOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'})
    });
     return this.authHttp.post(this.server + 'api/delete_journey', payload,
        options).map((res: Response) => res.json());
  }

  public updateNotes(payload:string) {
    let options: RequestOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'})
    });
     return this.authHttp.post(this.server + 'api/update_notes', payload,
        options).map((res: Response) => res.json());
  }

}
