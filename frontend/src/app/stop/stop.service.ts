import { Injectable } from '@angular/core';


@Injectable()

export class StopService { 

    stop:Array<any>;
    constructor() {
        this.stop = [
            { location: 'China' },
            { location: 'Japan' },
            { location: 'France' },
            { location: 'India' },
            { location: 'USA' }
        ];
    }

    getStops() {
        return this.stop;
    }
}
