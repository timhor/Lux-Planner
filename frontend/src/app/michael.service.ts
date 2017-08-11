import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';



@Injectable()

export class MichaelService {

        private server = 'http://127.0.0.1:5000/';
        private httpPoint;

    destinations:Array<any>;
    constructor(private http: Http) {
        this.httpPoint = http;
    }

    getServiceData() {
        console.log("Hello from service");
        //this.http.get();
    }
}