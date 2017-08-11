import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';

@Injectable()
export class WebService {
  constructor() { }

  public getDataFromBackend() {
    return this.authService.postResource('', '/api/getdata');
  }

  public isAuthenticated() {
    if (!this.authService.isAuthenticated()) {
      this.authService.clearUserDataAndRedirect();
    }
  }
}
