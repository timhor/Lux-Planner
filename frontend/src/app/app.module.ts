import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { provideAuth } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { SearchComponent } from './search.component';
import { DestinationComponent } from './destination.component';
import { MichaelComponent } from './michael.component';

import { DestinationService } from './destination.service';
import { MichaelService } from './michael.service';


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
  providers: [DestinationService, MichaelService,
    provideAuth({
      headerPrefix: 'JWT'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
