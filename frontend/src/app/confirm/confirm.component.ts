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
    document.documentElement.setAttribute('style', 'overflow-y: hidden;');
    document.getElementsByClassName('navbar-right')[0].setAttribute('style', 'margin-right: 17px;');
    // "wrap" class is used for the main body of the page (between navbar and footer)
    document.getElementById('wrap').setAttribute('style', 'margin-right: 17px;');
    document.getElementById('footerLinks').setAttribute('style', 'margin-right: 2px;');
    document.getElementById('subText').setAttribute('style', 'margin-right: 2px;');
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    document.documentElement.setAttribute('style', 'overflow-y: scroll');
    document.getElementsByClassName('navbar-right')[0].setAttribute('style', 'margin-right: 0;');
    document.getElementById('wrap').setAttribute('style', 'margin-right: 0;');
    document.getElementById('footerLinks').setAttribute('style', 'margin-right: -15px;');
    document.getElementById('subText').setAttribute('style', 'margin-right: -15px;');
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
}

