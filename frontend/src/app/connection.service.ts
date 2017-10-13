import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ConnectionService {
    private server: string = !isDevMode() ? 'https://seng2021-lux-api.herokuapp.com/': 'http://localhost:5000/';
    private result: Array<any>;

    destinations:Array<any>;
    constructor(private http: Http, private authHttp: AuthHttp) {
        // this.httpPoint = http;
    }

    getServiceData(endpoint: String) {
        return this.http.get(this.server + endpoint).map(response => response.json());
    }

    getProtectedData(endpoint: String) {
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

    //             let jwtHelper: JwtHelper = new JwtHelper();
    //         },
    //         (error) => console.log(`Sumting wong: ${error}`)
    //     )
    // }


    // flickrSearch() {
    //     var stuff = this.httpPoint.get(this.server + "api/flickr?search=Paris&results=1");
    //     return stuff;
    // }

    // wikiSearch(search: String) {
    //     var conn = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&titles=" + search + "&callback=?";
    //     return this.http.get(conn).map(response => response.json());
    // }
}
