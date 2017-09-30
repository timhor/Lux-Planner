// Used to share active journey/stop index between components

import { Injectable } from '@angular/core';

@Injectable()
export class JourneyService {
   public activeJourneyIndex = 0;
}
