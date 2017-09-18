import { Component } from '@angular/core';
import { StopService } from './stop.service';
import { ConnectionService } from '../connection/connection.service';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';

@Component({
    selector: 'app-stop',
    providers : [StopService, ConnectionService],
    styleUrls: ['./stop.component.css'],
    templateUrl: './stop.component.html',
})
export class StopComponent {
    public componentName: string = 'StopComponent';
    public currStop = 'Tokyo';
    public stops;
    public bannerPhoto: string = "https://dummyimage.com/650x300/000000/baffef&text=No+Image+Available";
    public connService: ConnectionService;
    public aboutText: string = "Loading Information...";
    // public attractions_index = [0,3,6,9];
    public attractions_list;    
    public attraction_names = [];
    public attraction_address = [];
    public attraction_ratings = [];
    public visible = false;
    public visibleAnimate = false;
    public attractions: Array<any> = [];
    public location_images = [];

    // Inject StopService and assign it to _stopService
    constructor(_stopService: StopService, _connectionService: ConnectionService) {
        // Utilize .get request from app/stop.service.ts to populate stops object
        this.stops = _stopService.getStops();
        this.connService = _connectionService;
        // this.getBannerPhoto();
        // https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&titles=Tokyo&callback=?
        // this.aboutText = _connectionService.wikiSearch("Tokyo").subscribe(
        //     (data) => console.log(data)
        // );
        // console.log(this.aboutText);

        // this.connService.getServiceData('api/stop_information/?stop=tokyo').subscribe(
        //     res => {
        //         this.aboutText = res.info; 
        //         console.log("About text is " + this.aboutText);   
        //     }        
        // );

        // this.connService.getServiceData('api/places/?place=Tokyo').subscribe(
        //     res => {
        //         res.forEach(place => {
        //             console.log("Name is: " + place.name + "  --  Address is: " + place.address + "  --  Ratings : " + place.ratings+ "  --  Ratings : " + place.photo);
        //         });
        //         this.attractions = res;

                // this.attractions_list = res.results; 
                
                // Comment Below is for SORT BY RATINGS
                // this.attractions_list.sort(function(a, b) {
                //     return parseFloat(b.rating) - parseFloat(a.rating);
                // });

                // for (var i = 0; i < 12; i++) {
                //     var obj = this.attractions_list[i];
                //     var name = obj.name;
                //     var address = obj.vicinity;
                //     var ratings = obj.rating;
                //     if (name == null){  name = "Could not find attraction";  }
                //     if (address == null){   address = "Address not known";  }
                //     if (ratings == null){   ratings = "Unrated";    }
                //     if (obj == null){   continue;   }
                //     this.attraction_names.push(name);
                //     this.attraction_address.push(address);
                //     this.attraction_ratings.push(ratings);
                //     // console.log("Name is: " + name + "  --  Address is: " + address + "  --  Ratings : " + ratings);
                // }
        //     }        
        // );
        // this.connService.getServiceData('api/places/?place=tokyo').subscribe(res => this.attractions_list = res.results);        
        // console.log("Attractions list is: " + this.attractions_list);
        // for(var i = 0; i < this.attractions_list.length; i++) {
        //     var obj = this.attractions_list[i];
        //     console.log(obj.id);
        // }
    }

    getBannerPhoto() {
        this.connService.getServiceData('api/flickr/?search='+this.currStop+'%20Landmarks&results=0-9').subscribe(res => this.location_images = res.images);
        
        console.log("Hello with " + this.bannerPhoto);
    }

    public show(stop): void {
        if (stop === "") {
            return;
        }
        this.currStop = stop;
        this.getBannerPhoto();

        this.connService.getServiceData('api/stop_information/?stop='+ this.currStop).subscribe(
            res => {
                this.aboutText = res.info; 
                console.log("About text is " + this.aboutText);   
            }        
        );

        this.connService.getServiceData('api/places/?place='+ this.currStop).subscribe(
            res => {
                res.forEach(place => {
                    console.log("Name is: " + place.name + "  --  Address is: " + place.address + "  --  Ratings : " + place.ratings+ "  --  Ratings : " + place.photo);
                });
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
