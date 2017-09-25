import { Injectable } from '@angular/core';

@Injectable()
export class ModifyJourneyService {
  public isModifying:boolean = false;
  public journeyIndex:number;
  constructor() { }

}
