import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { provideAuth } from 'angular2-jwt';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp, JwtHelper, AuthConfig } from 'angular2-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component'
import { SearchComponent } from './search/search.component';
import { StopComponent } from './stop/stop.component';
import { ConnectionComponent } from './connection/connection.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { JourneyComponent } from './journey/journey.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { HelpComponent } from './help/help.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { MyJourneysComponent } from './my-journeys/my-journeys.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ConfirmComponent } from './confirm/confirm.component';

import { StopService } from './stop/stop.service';
import { ConnectionService } from './connection/connection.service';
import { LoggedInService } from './loggedIn.service';
import { SearchService } from './search/search.service';
import { JourneyService } from './journey.service';

import { DropdownModule } from "ngx-dropdown";
import { NgxTimelineModule } from 'ngx-timeline';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScheduleModule, CalendarModule } from 'primeng/primeng';
import { TooltipModule } from 'ngx-tooltip';
import { SimpleNotificationsModule } from 'angular2-notifications';

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
  StopService, 
  ConnectionService, 
  authProvider, 
  LoggedInService, 
  SearchService,
  JourneyService
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
   	SearchComponent,
   	StopComponent,
    ConnectionComponent,
    SignupComponent,
    AboutComponent,
    ContactUsComponent,
    JourneyComponent,
    DashboardComponent,
    ItineraryComponent,
    HelpComponent,
    ProfileComponent,
    AccountSettingsComponent,
    MyJourneysComponent,
    NotFoundComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAWhdBjPKjj_DNstBfp3i65VTtCeEzucyc',
      libraries: ["places"]
    }),
    NgxTimelineModule,
    BrowserAnimationsModule,
    ScheduleModule,
    CalendarModule,
    TooltipModule,
    SimpleNotificationsModule.forRoot()
  ],
  providers:
    serviceProviders
  ,
  bootstrap: [AppComponent]
})
export class AppModule {}
