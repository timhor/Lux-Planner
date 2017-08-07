import { Injectable } from '@angular/core';


@Injectable()

export class FriendService { 

    friends:Array<any>;
    constructor() {
        this.friends = [
            { age: 20, name: 'Tim Hor' },
            { age: 20, name: 'Michael Tran' },
            { age: 20, name: 'Vintony Padmadiredja' },
            { age: 20, name: 'Soham Dinesh Patel' },
            { age: 20, name: 'Aydin Ercan' }
        ];
    }

    getFriends() {
        return this.friends;
    }
}