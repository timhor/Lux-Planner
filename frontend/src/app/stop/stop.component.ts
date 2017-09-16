import { Component } from '@angular/core';
import { StopService } from './stop.service';
import { ConnectionService } from '../connection/connection.service';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';

@Component({
    selector: 'my-stops',
    providers : [StopService, ConnectionService],
    styleUrls: ['./stop.component.css'],
    templateUrl: './stop.component.html',
})
export class StopComponent {
    public componentName = 'StopComponent';
    public currStop = 'Paris';
    public stops;
    public bannerPhoto = "http://via.placeholder.com/650x300";
    public connService: ConnectionService;
    public aboutText = "Test";

    // Inject StopService and assign it to _stopService
    constructor(_stopService: StopService, _connectionService: ConnectionService) {
        // Utilize .get request from app/stop.service.ts to populate stops object
        this.stops = _stopService.getStops();
        this.connService = _connectionService;
        this.getBannerPhoto();
        // https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&titles=Tokyo&callback=?
        this.aboutText = _connectionService.wikiSearch("Tokyo").subscribe(
            (data) => console.log(data)
        );
        console.log(this.aboutText);
    }

    getBannerPhoto() {
        // this.bannerPhoto = this.connService.flickrSearch();
        this.connService.getServiceData('api/flickr/?search=Paris%20Landmarks&results=1').subscribe(res => this.bannerPhoto = res.images[0]);
        
        
        console.log("Hello with " + this.bannerPhoto);

    }
}
