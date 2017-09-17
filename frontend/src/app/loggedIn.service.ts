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

  public signup(username: string, password: string, email: string) {

    let options: RequestOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'})
    });
     return this.http.post(this.server + 'api/new_user', JSON.stringify({'username': username, 
        'password': password, 'email': email}),
        options).map((res: Response) => res.json());
  }

}
