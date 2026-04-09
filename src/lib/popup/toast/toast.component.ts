import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ToastConfig, ToastThemeType } from '../popup.models';
import { ToastService } from '../toast.service';

@Component({
  selector: 'popup-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styles: [`
    :host {
      display: block;
      pointer-events: auto;
      opacity: 0;
      transform: translateY(2rem);
      transition: opacity 500ms ease-in, transform 500ms ease-in;
    }
    :host(.show) {
      opacity: 1;
      transform: translateY(0);
    }
    .card { margin-bottom: 0.5rem; border-radius: 8px; }
    .toast-success { color: #fff; background-color: #6ab045; border-color: #6ab045; }
    .toast-warning { color: #222; background-color: #ffc107; border-color: #ffc107; }
    .toast-danger { color: #fff; background-color: #dc3545; border-color: #dc3545; }
    .toast-primary { color: #fff; background-color: #183a5c; border-color: #183a5c; }
    .toast-secondary { color: #fff; background-color: #6c757d; border-color: #6c757d; }
    .toast-info { color: #fff; background-color: #0dcaf0; border-color: #0dcaf0; }
  `]
})
export class ToastComponent implements OnInit {
  @Input() guid: string;
  @Input() set config(config: ToastConfig) {
    this._config = config;
    this.theme = this.getThemeClass();
  }
  get config(): ToastConfig { return this._config; }
  private _config: ToastConfig;

  theme: string = '';

  constructor(private service: ToastService, private elRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    if (this.config) {
      if (this.config.onLoad) this.config.onLoad();
      // Defer to next frame so the initial (hidden) styles are committed
      // before the .show class triggers the CSS transition.
      requestAnimationFrame(() => this.elRef.nativeElement.classList.add('show'));
      this.setupTimeout();
    }
  }

  private setupTimeout(): void {
    setTimeout(() => {
      this.elRef.nativeElement.classList.remove('show');
      if (this.config?.onClose) this.config.onClose();
      setTimeout(() => this.service.removeToast(this.guid), 500);
    }, Math.max((this.config.timeout ?? 3000) - 500, 0));
  }

  private getThemeClass(): string {
    switch (this.config?.theme) {
      case ToastThemeType.Success: return 'toast-success';
      case ToastThemeType.Warning: return 'toast-warning';
      case ToastThemeType.Danger: return 'toast-danger';
      case ToastThemeType.Primary: return 'toast-primary';
      case ToastThemeType.Secondary: return 'toast-secondary';
      case ToastThemeType.Info: return 'toast-info';
      default: return '';
    }
  }
}
