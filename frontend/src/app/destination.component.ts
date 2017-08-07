import { Component } from '@angular/core';
import { DestinationService } from 'app/destination.service';

@Component({
    selector: 'my-destinations',
    providers : [DestinationService],
    styles: [`
         div { 
     background-color:#EFEFEF;
     margin-bottom:15px;
     padding:15px;
     border:1px solid #DDD;
     box-shadow:2px 2px 2px 0 rgba(0, 0, 0, 0.3);
     border-radius:3px;
  }
  h2 { 
    text-align: center;
  }
  h4 {
    font-style: italic;
  }
    `],
    template: `
        <h2>Hello from the {{componentName}}!</h2>
        <div *ngFor="let d of destinations">
        <h4> Location : {{d.location}} </h4> <h4>Cost: \${{d.cost}}</h4> 
        </div>
    `
})
export class DestinationComponent {
    public componentName = 'DestinationComponent';
    public destinations;

    // Inject DestinationService and assign it to _destinationService
    constructor(_destinationService: DestinationService) {
        // Utilize .get request from app/destination.service.ts to populate destinations object
        this.destinations = _destinationService.getDestinations();
    }
}