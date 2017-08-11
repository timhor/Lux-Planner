import { Component } from '@angular/core';
import { MichaelService } from 'app/michael.service';

@Component({
    selector: 'michael-test',
    providers : [MichaelService],
    templateUrl: './michael.component.html',
})
export class MichaelComponent {
    public componentName = 'MichaelComponent';
    public destinations;
    private mService;

    // Inject DestinationService and assign it to _destinationService
    constructor(_michaelService: MichaelService) {
        // Utilize .get request from app/destination.service.ts to populate destinations object
        this.mService = _michaelService;
    }

    public getData() {
        console.log("Hello from component");
        this.mService.getServiceData();
    }
}