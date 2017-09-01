import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { provideAuth } from 'angular2-jwt';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp, JwtHelper, AuthConfig } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component'
import { SearchComponent } from './search/search.component';
import { DestinationComponent } from './destination/destination.component';
import { ConnectionComponent } from './connection/connection.component';

import { DestinationService } from './destination/destination.service';
import { ConnectionService } from './connection/connection.service';

import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { JourneyComponent } from './journey/journey.component';

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
  DestinationService, ConnectionService, authProvider
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
   	SearchComponent,
   	DestinationComponent,
    ConnectionComponent,
    SignupComponent,
    AboutComponent,
    ContactUsComponent,
    JourneyComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers:
    serviceProviders
  ,
  bootstrap: [AppComponent]
})
export class AppModule {}
