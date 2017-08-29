import { Component } from '@angular/core';
import { DestinationService } from './destination.service';

@Component({
    selector: 'my-destinations',
    providers : [DestinationService],
    styleUrls: ['./destination.component.css'],
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
