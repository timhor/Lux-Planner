import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ConnectionService {
    private server: string = !isDevMode() ? 'https://seng2021-lux-api.herokuapp.com/': 'http://localhost:5000/';
    private result: Array<any>;

    constructor(private http: Http, private authHttp: AuthHttp) {}

    getServiceData(endpoint: String) {
        return this.http.get(this.server + endpoint).map(response => response.json());
    }

    getProtectedData(endpoint: String) {
        return this.authHttp.get(this.server + endpoint).map(response => response.json());
    }
}
