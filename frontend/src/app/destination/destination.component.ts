import { Component } from '@angular/core';
import { DestinationService } from './destination.service';
import { ConnectionService } from '../connection/connection.service';

@Component({
    selector: 'my-destinations',
    providers : [DestinationService, ConnectionService],
    styleUrls: ['./destination.component.css'],
    templateUrl: './destination.component.html',
})
export class DestinationComponent {
    public componentName = 'DestinationComponent';
    public currDestination = 'Paris';
    public destinations;
    public bannerPhoto = "http://via.placeholder.com/650x300";
    public connService: ConnectionService;

    // Inject DestinationService and assign it to _destinationService
    constructor(_destinationService: DestinationService, _connectionService: ConnectionService) {
        // Utilize .get request from app/destination.service.ts to populate destinations object
        this.destinations = _destinationService.getDestinations();
        this.connService = _connectionService;
        this.getBannerPhoto();
    }

    getBannerPhoto() {
        // this.bannerPhoto = this.connService.flickrSearch();
        this.connService.getServiceData('api/flickr/?search=Paris&results=3').subscribe(res => this.bannerPhoto = res.images[0]);
        
        
        console.log("Hello with " + this.bannerPhoto);

    }
}
