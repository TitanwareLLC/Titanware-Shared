import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'popup-host',
  standalone: true,
  template: '<div #toasts class="toast-cntr"></div>',
  styles: [`
    .toast-cntr {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      position: fixed;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      width: max(30vw, 30rem);
      pointer-events: none;
    }
  `]
})
export class PopupHostComponent implements AfterViewInit {
  @ViewChild('toasts', { read: ElementRef, static: true }) container: ElementRef;

  constructor(private toastService: ToastService) { }

  ngAfterViewInit(): void {
    this.toastService.container = this.container;
  }
}
