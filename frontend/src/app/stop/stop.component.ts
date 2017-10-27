import { Component } from '@angular/core';
import { StopService } from './stop.service';
import { ConnectionService } from '../connection.service';

@Component({
    selector: 'stop-info',
    providers : [StopService, ConnectionService],
    styleUrls: ['../app.component.css', './stop.component.css'],
    templateUrl: './stop.component.html',
})
export class StopComponent {
    public componentName: string = 'StopComponent';
    public currStop: string = 'Tokyo';
    public stops: Array<any>;
    public bannerPhoto: string = "https://dummyimage.com/650x300/000000/baffef&text=No+Image+Available";
    public aboutText: string = "Loading Information...";
    public visible: boolean = false;
    public visibleAnimate: boolean = false;
    public attractions: Array<any> = [];
    public location_images: Array<any> = [];
    public isLoading: boolean = true;

    // Inject StopService and assign it to _stopService
    constructor(_stopService: StopService, private connService: ConnectionService) {            
        // Utilize .get request from app/stop.service.ts to populate stops object
        this.stops = _stopService.getStops();
    }

    public getBannerPhoto() {
        this.connService.getServiceData('api/flickr/?search='+this.currStop+'%20Landmarks&results=0-9')
            .subscribe(res => this.location_images = res.images);
    }

    public show(stop): void {
        if (stop === null || stop === undefined) {
            return;
        }

        if (window.screen.width >= 768) {
            document.documentElement.setAttribute('style', 'overflow-y: hidden;');
            document.getElementsByClassName('navbar-right')[0].setAttribute('style', 'margin-right: 17px;');
            // "wrap" class is used for the main body of the page (between navbar and footer)
            document.getElementById('wrap').setAttribute('style', 'margin-right: 17px;');
            document.getElementById('footerLinks').setAttribute('style', 'margin-right: 2px;');
            document.getElementById('subText').setAttribute('style', 'margin-right: 2px;');
        }

        this.currStop = stop;
        this.getBannerPhoto();

        this.connService.getServiceData('api/stop_information/?stop='+ this.currStop).subscribe(
            res => {
                this.aboutText = res.info;   
            }        
        );

        this.connService.getServiceData('api/places/?place='+ this.currStop).subscribe(
            res => {
                this.attractions = res;
                this.isLoading = false;
            }        
        );
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true, 100);
    }
  
    public hide(): void {
        if (window.screen.width >= 768) {
            document.documentElement.setAttribute('style', 'overflow-y: scroll');
            document.getElementsByClassName('navbar-right')[0].setAttribute('style', 'margin-right: 0;');
            document.getElementById('wrap').setAttribute('style', 'margin-right: 0;');
            document.getElementById('footerLinks').setAttribute('style', 'margin-right: -15px;');
            document.getElementById('subText').setAttribute('style', 'margin-right: -15px;');
        }
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
