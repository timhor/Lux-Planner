import { Injectable } from '@angular/core';


@Injectable()

export class MichaelService {

    private server = 'http://127.0.0.1:5000/'

    destinations:Array<any>;
    constructor() {
        this.destinations = [
            { cost: 2000, location: 'China' },
            { cost: 3000, location: 'Japan' },
            { cost: 4000, location: 'France' },
            { cost: 5000, location: 'India' },
            { cost: 6000, location: 'USA' }
        ];
    }

    getDestinations() {
        return this.destinations;
    }

    getServiceData() {
        console.log("Hello from service");
    }
}