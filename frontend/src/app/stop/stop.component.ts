import { Component } from '@angular/core';
import { StopService } from './stop.service';
import { ConnectionService } from '../connection/connection.service';

@Component({
    selector: 'stop-info',
    providers : [StopService, ConnectionService],
    styleUrls: ['./stop.component.css'],
    templateUrl: './stop.component.html',
})
export class StopComponent {
    public componentName: string = 'StopComponent';
    public currStop: string = 'Tokyo';
    public stops: Array<any>;
    public bannerPhoto: string = "https://dummyimage.com/650x300/000000/baffef&text=No+Image+Available";
    public connService: ConnectionService;
    public aboutText: string = "Loading Information...";
    public visible: boolean = false;
    public visibleAnimate: boolean = false;
    public attractions: Array<any> = [];
    public location_images: Array<any> = [];

    // Inject StopService and assign it to _stopService
    constructor(_stopService: StopService, _connectionService: ConnectionService) {
        // Utilize .get request from app/stop.service.ts to populate stops object
        this.stops = _stopService.getStops();
        this.connService = _connectionService;
    }

    getBannerPhoto() {
        this.connService.getServiceData('api/flickr/?search='+this.currStop+'%20Landmarks&results=0-9')
            .subscribe(res => this.location_images = res.images);
        // console.log("Hello with " + this.bannerPhoto);
    }

    public show(stop): void {
        if (stop === null || stop === undefined) {
            return;
        }
        this.currStop = stop;
        this.getBannerPhoto();

        this.connService.getServiceData('api/stop_information/?stop='+ this.currStop).subscribe(
            res => {
                this.aboutText = res.info; 
                // console.log("About text is " + this.aboutText);   
            }        
        );

        this.connService.getServiceData('api/places/?place='+ this.currStop).subscribe(
            res => {
                // res.forEach(place => {
                //     console.log("Name is: " + place.name + "  --  Address is: " + place.address + "  --  Ratings : " + place.ratings+ "  --  Ratings : " + place.photo);
                // });
                this.attractions = res;
            }        
        );
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true, 100);
    }
  
    public hide(): void {
        // Clear all data in vars
        this.location_images = [];
        this.attractions = [];
        this.aboutText = "Loading Information...";
        this.currStop = "";

        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
    }
  
    public onContainerClicked(event: MouseEvent): void {
        if ((<HTMLElement>event.target).classList.contains('modal')) {
            this.hide();
        }
    }
}
