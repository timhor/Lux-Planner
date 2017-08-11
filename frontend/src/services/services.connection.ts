import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';

const APP_SERVER = 'http://127.0.0.1:5000/';


@Injectable()
export class Services {
  constructor(private http: Http) { }

  public helloBackendHandler() {
  	console.log("Hello from Backend Handler!");
  }

}
