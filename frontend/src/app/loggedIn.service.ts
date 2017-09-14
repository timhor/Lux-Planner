import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp, JwtHelper } from 'angular2-jwt';

@Injectable()
export class LoggedInService {
//   public loggedIn:boolean = false;
  private server = 'http://localhost:5000/';

  constructor(private http: Http, private authHttp: AuthHttp) {
      if (localStorage['id_token']) {
        //   this.loggedIn = true;
      }
  }

  public login(username: String, password: String) {
    let options: RequestOptions = new RequestOptions({
        headers: new Headers({'Content-Type': 'application/json'})
    });
    this.http.post(this.server + 'auth', JSON.stringify({'username': username, 'password': password}),
        options)
    .map((res: Response) => res.json())
    .subscribe(
        (data) => {
            let token = data.access_token;
            localStorage.setItem('id_token', token);  // 'id_token' is the default location AuthHTTP looks for
            console.log("Token saved successfully?");

            let jwtHelper: JwtHelper = new JwtHelper();
            console.log(`expiration: ${jwtHelper.getTokenExpirationDate(token)}`);
            console.log(`is expired: ${jwtHelper.isTokenExpired(token)}`);
            console.log(`decoded: ${JSON.stringify(jwtHelper.decodeToken(token))}`);
        },
        (error) => console.log(`Sumting wong: ${error}`)
    )
  }

  public loggedIn() {
        // return localStorage['id_token'];
        if (localStorage['id_token']) {
            return true;
        }
        return false;
  }

}
