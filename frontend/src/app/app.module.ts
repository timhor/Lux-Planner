import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { provideAuth } from 'angular2-jwt';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp, JwtHelper, AuthConfig } from 'angular2-jwt';


import { AppComponent } from './app.component';
import { SearchComponent } from './search.component';
import { DestinationComponent } from './destination.component';
import { MichaelComponent } from './michael.component';

import { DestinationService } from './destination.service';
import { MichaelService } from './michael.service';

export function authFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'JWT'
  }), http, options);
};

export const authProvider = {
  provide: AuthHttp,
  deps: [Http, RequestOptions],
  useFactory: authFactory
};

export const serviceProviders = [
  DestinationService, MichaelService, authProvider
];

@NgModule({
  declarations: [
    AppComponent,
   	SearchComponent,
   	DestinationComponent,
    MichaelComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers:
    serviceProviders
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }
