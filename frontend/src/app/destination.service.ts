import { Injectable } from '@angular/core';


@Injectable()

export class DestinationService { 

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
}