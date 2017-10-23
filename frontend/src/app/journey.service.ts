// Used to share active journey/stop index between components

import { Injectable } from '@angular/core';

@Injectable()
export class JourneyService {
   public activeJourneyIndex: number = 0;
//    public addNewStop: boolean;
}
