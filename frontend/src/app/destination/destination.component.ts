import { Component } from '@angular/core';
import { DestinationService } from './destination.service';

@Component({
    selector: 'my-destinations',
    providers : [DestinationService],
    styleUrls: ['./destination.component.css'],
    templateUrl: './destination.component.html',
})
export class DestinationComponent {
    public componentName = 'DestinationComponent';
    public currDestination = 'Paris';
    public destinations;

    // Inject DestinationService and assign it to _destinationService
    constructor(_destinationService: DestinationService) {
        // Utilize .get request from app/destination.service.ts to populate destinations object
        this.destinations = _destinationService.getDestinations();
    }
}
