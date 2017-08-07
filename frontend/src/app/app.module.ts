import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchComponent } from './search.component';
import { DestinationComponent } from './destination.component';

import { DestinationService } from './destination.service';

@NgModule({
  declarations: [
    AppComponent,
   	SearchComponent,
   	DestinationComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [DestinationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
