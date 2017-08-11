import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MichaelService {

        private server = 'http://127.0.0.1:5000/';
        private httpPoint;
        private string;
        private result: Array<any>;
        private people;

    destinations:Array<any>;
    constructor(private http: Http) {
        this.httpPoint = http;
    }

    getServiceData() {
        console.log("Hello from service");
        this.string = this.server + "api/hello";
        console.log(this.string);
        this.httpPoint.get(this.string).subscribe(response => this.result = response.json());
        console.log(this.result);
        //console.log(this.people);
    }
}