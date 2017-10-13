import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public visible: boolean = false;
  public visibleAnimate: boolean = false;

  public show(): void {
    document.documentElement.setAttribute('style', 'overflow-y: hidden; margin-right:17px;');
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    document.documentElement.setAttribute('style', 'overflow-y: scroll');
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
}

