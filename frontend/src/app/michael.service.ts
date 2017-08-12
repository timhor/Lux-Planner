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
    constructor(private http: Http) {
        this.httpPoint = http;
    }

    getServiceData(endpoint: String) {
        console.log("Hello from service");
        this.string = this.server + endpoint;
        console.log(this.string);
        return this.httpPoint.get(this.string).map(response => response.json());
    }
}