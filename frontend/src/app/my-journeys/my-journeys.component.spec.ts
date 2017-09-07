import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJourneysComponent } from './my-journeys.component';

describe('MyJourneysComponent', () => {
  let component: MyJourneysComponent;
  let fixture: ComponentFixture<MyJourneysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyJourneysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyJourneysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
