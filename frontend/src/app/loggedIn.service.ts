import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp, JwtHelper } from 'angular2-jwt';

@Injectable()
export class LoggedInService {
  private server = 'http://localhost:5000/';

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

  public signup(username: string, password: string, email: string, firstName: string, lastName: string, gender: string) {

    let options: RequestOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'})
    });
     return this.http.post(this.server + 'api/new_user', JSON.stringify({'username': username, 
        'password': password, 'email': email, 'firstName': firstName, 'lastName': lastName, 'gender': gender}),
        options).map((res: Response) => res.json());
  }

  public changeDetails(changeType: string, changedInfo: string) {

    let options: RequestOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'})
    });
    if (changeType == 'password') {
        return this.authHttp.post(this.server + 'api/change_user_password/', JSON.stringify({'password': changedInfo}),
        options).map((res: Response) => res.json());
    } else if (changeType == 'email') {
        return this.authHttp.post(this.server + 'api/change_user_email/', JSON.stringify({'email': changedInfo}),
        options).map((res: Response) => res.json());
    } else if (changeType == 'firstName') {
        return this.authHttp.post(this.server + 'api/change_user_first_name/', JSON.stringify({'firstName': changedInfo}),
        options).map((res: Response) => res.json());
    } else if (changeType == 'lastName') {
        return this.authHttp.post(this.server + 'api/change_user_last_name/', JSON.stringify({'lastName': changedInfo}),
        options).map((res: Response) => res.json());
    }
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
