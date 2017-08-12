import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp, JwtHelper } from 'angular2-jwt';

@Injectable()
export class MichaelService {

        private server = 'http://127.0.0.1:5000/';
        private httpPoint;
        private string;
        private result: Array<any>;

    destinations:Array<any>;
    constructor(private http: Http, private authHttp: AuthHttp) {
        this.httpPoint = http;
    }

    getServiceData(endpoint: String) {
        console.log("Hello from service");
        this.string = this.server + endpoint;
        console.log(this.string);
        return this.httpPoint.get(this.string).map(response => response.json());
    }

    getProtectedData(endpoint: String) {
        console.log("Hello from service");
        this.string = this.server + endpoint;
        console.log(this.string);
        return this.authHttp.get(this.string).map(response => response.json());
    }

    login() {
        let options: RequestOptions = new RequestOptions({
            headers: new Headers({'Content-Type': 'application/json'})
        });
        this.httpPoint.post(this.server + 'auth', JSON.stringify({'username': 'bob', 'password': 'smith'}),
            options)
        .map((res: Response) => res.json())
        .subscribe(
            (data) => {
                let token = data.access_token;
                localStorage.setItem('id_token', token);
                console.log("Token saved successfully?");

                let jwtHelper: JwtHelper = new JwtHelper();
                console.log(`expiration: ${jwtHelper.getTokenExpirationDate(token)}`);
                console.log(`is expired: ${jwtHelper.isTokenExpired(token)}`);
                console.log(`decoded: ${JSON.stringify(jwtHelper.decodeToken(token))}`);
            },
            (error) => console.log(`Sumting wong: ${error}`)
        )
    }
}