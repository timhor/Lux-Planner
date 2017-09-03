import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl,
  FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyComponent implements OnInit {


  myJourneys: FormGroup;
  
  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // build the form model
    this.myJourneys = this.fb.group({
      destinations: this.fb.array(
        [this.buildItem('')]
      )
    })
  }

  submit() {
    console.log("Reactive Form submitted: ", this.myJourneys)
  }

  buildItem(val: string) {
    return new FormGroup({
      location: new FormControl(val, Validators.required),
      date: new FormControl()
    })
  }

}
