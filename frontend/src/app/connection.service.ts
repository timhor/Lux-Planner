import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp, JwtHelper } from 'angular2-jwt';

@Injectable()
export class ConnectionService {
    private server: string = !isDevMode() ? 'https://seng2021-lux-api.herokuapp.com/': 'http://localhost:5000/';
    private httpPoint: Http;
    private result: Array<any>;

    destinations:Array<any>;
    constructor(private http: Http, private authHttp: AuthHttp) {
        this.httpPoint = http;
    }

    getServiceData(endpoint: String) {
        console.log("Hello from service");
        console.log(this.server + endpoint);
        return this.httpPoint.get(this.server + endpoint).map(response => response.json());
    }

    getProtectedData(endpoint: String) {
        console.log("Hello from protected");
        console.log(this.server + endpoint);
        return this.authHttp.get(this.server + endpoint).map(response => response.json());
    }

    // login() {
    //     let options: RequestOptions = new RequestOptions({
    //         headers: new Headers({'Content-Type': 'application/json'})
    //     });
    //     this.httpPoint.post(this.server + 'auth', JSON.stringify({'username': 'admin', 'password': 'admin'}),
    //         options)
    //     .map((res: Response) => res.json())
    //     .subscribe(
    //         (data) => {
    //             let token = data.access_token;
    //             localStorage.setItem('id_token', token);  // 'id_token' is the default location AuthHTTP looks for
    //             console.log("Token saved successfully?");

    //             let jwtHelper: JwtHelper = new JwtHelper();
    //             console.log(`expiration: ${jwtHelper.getTokenExpirationDate(token)}`);
    //             console.log(`is expired: ${jwtHelper.isTokenExpired(token)}`);
    //             console.log(`decoded: ${JSON.stringify(jwtHelper.decodeToken(token))}`);
    //         },
    //         (error) => console.log(`Sumting wong: ${error}`)
    //     )
    // }


    // flickrSearch() {
    //     var stuff = this.httpPoint.get(this.server + "api/flickr?search=Paris&results=1");
    //     console.log(stuff);
    //     return stuff;
    // }

    wikiSearch(search: String) {
        var conn = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&titles=" + search + "&callback=?";
        console.log(conn);
        return this.httpPoint.get(conn).map(response => response.json());
    }
}
