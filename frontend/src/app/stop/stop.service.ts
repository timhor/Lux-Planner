import { Injectable } from '@angular/core';


@Injectable()

export class StopService { 

    stop:Array<any>;
    constructor() {
        this.stop = [
            { cost: 2000, location: 'China' },
            { cost: 3000, location: 'Japan' },
            { cost: 4000, location: 'France' },
            { cost: 5000, location: 'India' },
            { cost: 6000, location: 'USA' }
        ];
    }

    getStops() {
        return this.stop;
    }
}
