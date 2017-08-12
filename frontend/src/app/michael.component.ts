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
    private result;
    private messages: Array<String> = [];

    constructor(_michaelService: MichaelService) {
        this.mService = _michaelService;
    }

    public getData() {
        console.log("Hello from component");
        this.messages.push("Hello from component");
        this.mService.getServiceData("api/hello").subscribe(res => this.result = res);
        this.getPublic();
    }


    public getPublic() {
        this.mService.getServiceData("api/insecure").subscribe(res => this.messages.push(res.message));
    }

    public getPrivate() {

    }
}