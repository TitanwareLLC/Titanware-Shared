import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ToastConfig, ToastThemeType } from '../popup.models';
import { ToastService } from '../toast.service';

const fadeInOutAnimation = trigger('fadeInOut', [
  state('void', style({ opacity: 0, top: '2rem' })),
  state('fadeIn', style({ opacity: 1, top: '0' })),
  transition('void => fadeIn', [animate('500ms ease-in')]),
  transition('fadeIn => void', [animate('500ms ease-out')])
]);

@Component({
  selector: 'popup-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  animations: [fadeInOutAnimation],
  styles: [`
    :host { display: block; pointer-events: auto; }
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
  animationState: string = 'void';

  constructor(private service: ToastService) { }

  ngOnInit(): void {
    if (this.config) {
      if (this.config.onLoad) this.config.onLoad();
      this.animationState = 'fadeIn';
      this.setupTimeout();
    }
  }

  private setupTimeout(): void {
    setTimeout(() => {
      this.animationState = 'void';
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
