import { Component } from '@angular/core';
import { MichaelService } from 'app/michael.service';

@Component({
    selector: 'michael-test',
    providers : [MichaelService],
    templateUrl: './michael.component.html',
})
export class MichaelComponent {
    public componentName = 'MichaelComponent';
    public destinations;
    private mService;

    constructor(_michaelService: MichaelService) {
        this.mService = _michaelService;
    }

    public getData() {
        console.log("Hello from component");
        this.mService.getServiceData();
        //_michaelService.getServiceData();
    }
}