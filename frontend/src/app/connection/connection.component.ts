import { Component } from '@angular/core';
import { ConnectionService } from './connection.service';

@Component({
    selector: 'connection-test',
    providers : [ConnectionService],
    templateUrl: './connection.component.html',
})
export class ConnectionComponent {
    public componentName: string = 'ConnectionComponent';
    public destinations: Array<any>;
    private connService: ConnectionService;
    // private result;
    private messages: Array<String> = [];

    constructor(_connectionService: ConnectionService) {
        this.connService = _connectionService;
    }

    public getData() {
        console.log("Hello from component");
        this.messages.push("Hello from component");
        this.connService.getServiceData("api/hello").subscribe(res => console.log(res));
        this.getPrivate();
    }


    public getPublic() {
        this.connService.getServiceData("api/insecure").subscribe(
            (data) =>  {this.messages.push(`Hello world with message: ${data.message}`);
                        },
            (error) => this.messages.push(error)
            );
    }

    public getPrivate() {
        this.connService.getProtectedData('api/secure').subscribe(
            (data) =>  {this.messages.push(`Hello world with message: ${data.message}`);
                        },
            (error) => this.messages.push(error)
            );
    }

    public login() {
        this.connService.login();

    }

    public logout() {
        console.log(localStorage);
        this.messages.push(localStorage['id_token']);
        localStorage.removeItem('id_token');
    }
}
