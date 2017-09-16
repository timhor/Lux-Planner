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
    public componentName = 'StopComponent';
    public currStop = 'Tokyo';
    public stops;
    public bannerPhoto = "http://via.placeholder.com/650x300";
    public connService: ConnectionService;
    public aboutText = "Loading Information...";
    public attractions_list;    
    public attraction_names = [];
    public attraction_address = [];
    public attraction_ratings = [];
    public visible = false;
    public visibleAnimate = false;

    // Inject StopService and assign it to _stopService
    constructor(_stopService: StopService, _connectionService: ConnectionService) {
        // Utilize .get request from app/stop.service.ts to populate stops object
        this.stops = _stopService.getStops();
        this.connService = _connectionService;
        this.getBannerPhoto();
        // https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&titles=Tokyo&callback=?
        // this.aboutText = _connectionService.wikiSearch("Tokyo").subscribe(
        //     (data) => console.log(data)
        // );
        // console.log(this.aboutText);

        this.connService.getServiceData('api/stop_information/?stop=tokyo').subscribe(
            res => {
                this.aboutText = res.info; 
                console.log("About text is " + this.aboutText);   
            }        
        );

        this.connService.getServiceData('api/places/?place=Tokyo').subscribe(
            res => {
                this.attractions_list = res.results; 
                
                // Comment Below is for SORT BY RATINGS
                // this.attractions_list.sort(function(a, b) {
                //     return parseFloat(b.rating) - parseFloat(a.rating);
                // });

                for (var i = 0; i < 12; i++) {
                    var obj = this.attractions_list[i];
                    var name = obj.name;
                    var address = obj.vicinity;
                    var ratings = obj.rating;
                    if (name == null){  name = "Could not find attraction";  }
                    if (address == null){   address = "Address not known";  }
                    if (ratings == null){   ratings = "Unrated";    }
                    if (obj == null){   continue;   }
                    this.attraction_names.push(name);
                    this.attraction_address.push(address);
                    this.attraction_ratings.push(ratings);
                    // console.log("Name is: " + name + "  --  Address is: " + address + "  --  Ratings : " + ratings);
                }
            }        
        );
        // this.connService.getServiceData('api/places/?place=tokyo').subscribe(res => this.attractions_list = res.results);        
        // console.log("Attractions list is: " + this.attractions_list);
        // for(var i = 0; i < this.attractions_list.length; i++) {
        //     var obj = this.attractions_list[i];
        //     console.log(obj.id);
        // }
    }

    getBannerPhoto() {
        // this.bannerPhoto = this.connService.flickrSearch();
        this.connService.getServiceData('api/flickr/?search=Paris%20Landmarks&results=1').subscribe(res => this.bannerPhoto = res.images[0]);
        
        console.log("Hello with " + this.bannerPhoto);
    }

    public show(): void {
      this.visible = true;
      setTimeout(() => this.visibleAnimate = true, 100);
    }
  
    public hide(): void {
      this.visibleAnimate = false;
      setTimeout(() => this.visible = false, 300);
    }
  
    public onContainerClicked(event: MouseEvent): void {
      if ((<HTMLElement>event.target).classList.contains('modal')) {
        this.hide();
      }
    }
}
