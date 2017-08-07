import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchComponent } from './search.component';
import { FriendComponent } from './friend.component';

import { FriendService } from './friend.service';

@NgModule({
  declarations: [
    AppComponent,
   	SearchComponent,
   	FriendComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [FriendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
