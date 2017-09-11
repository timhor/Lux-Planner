import { Component } from '@angular/core';
import { Account } from './account';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  account = new Account('','','','');

  submitted = false;

  onSubmit() {
    this.submitted = true;
    
    //Add stuff here to send account details to backend
    //And redirect to --> routerLink="/login"

  }

  // For debugging
  get diagnostic() { return JSON.stringify(this.account); }
}
