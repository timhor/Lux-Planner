import { Component } from '@angular/core';
import { ConnectionService } from './connection.service';

@Component({
    selector: 'connection-test',
    providers : [ConnectionService],
    templateUrl: './connection.component.html',
})
export class ConnectionComponent {
    public componentName = 'ConnectionComponent';
    public destinations;
    private mService;
    private result;
    private messages: Array<String> = [];

    constructor(_connectionService: ConnectionService) {
        this.mService = _connectionService;
    }

    public getData() {
        console.log("Hello from component");
        this.messages.push("Hello from component");
        this.mService.getServiceData("api/hello").subscribe(res => this.result = res);
        // this.mService.login();
        // this.getPublic();
        this.getPrivate();
    }


    public getPublic() {
        this.mService.getServiceData("api/insecure").subscribe(
            (data) =>  {this.messages.push(`Hello world with message: ${data.message}`);
                       // this.mService.login();
                        },
            (error) => this.messages.push(error)
            );
    }

    public getPrivate() {
        this.mService.getProtectedData('api/secure').subscribe(
            (data) =>  {this.messages.push(`Hello world with message: ${data.message}`);
                       // this.mService.login();
                        },
            (error) => this.messages.push(error)
            );
    }

    public login() {
        this.mService.login();

    }

    public logout() {
        console.log(localStorage);
        this.messages.push(localStorage['id_token']);
        localStorage.removeItem('id_token');
    }
}
