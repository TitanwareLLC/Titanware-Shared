import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BannerButton, BannerConfig, BannerContentAlignmentType, BannerLocation, BannerThemeType } from '../popup.models';
import { AngularService } from '../angular.service';

const fadeInOutAnimation = trigger('fadeInOut', [
  state('void', style({ opacity: 0 })),
  state('fadeIn', style({ opacity: 1 })),
  transition('void => fadeIn', [animate('300ms ease-in')]),
  transition('fadeIn => void', [animate('300ms ease-out')])
]);

@Component({
  selector: 'popup-banner',
  standalone: true,
  animations: [fadeInOutAnimation],
  template: `
    @if (config) {
      <div class="banner-cntr {{ location }}" [@fadeInOut]="animationState">
        <div class="card shadow {{ theme }}">
          <div class="card-body row {{ alignment }}">
            @if (config?.message) {
              <div class="banner-msg col-md-6 col-12" [innerHTML]="config.message"></div>
            }
            <div class="d-flex justify-content-end col-md-6 mt-2 mb-2">
              @for (button of config.buttons; track button.buttonText) {
                <button class="btn {{ button.themeClass }} ms-2 me-2" (click)="onClick(button)">{{ button.buttonText }}</button>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .banner-top { top: 0; }
    .banner-bottom { bottom: 0; }
    .banner-cntr { display: flex; justify-content: center; z-index: 97; position: fixed; left: 0; right: 0; }
    .banner-cntr .card { z-index: 100; width: 100%; border-radius: 0; }
    .banner-content-left { display: flex; align-items: center; }
    .banner-content-center { display: flex; align-items: center; justify-content: center; }
    .banner-content-right { display: flex; align-items: center; justify-content: flex-end; }
    .banner-content-between { display: flex; align-items: center; justify-content: space-between; }
    .banner-success { color: #fff; background-color: #198754; border-color: #198754; }
    .banner-warning { color: #000; background-color: #ffc107; border-color: #ffc107; }
    .banner-danger { color: #fff; background-color: #dc3545; border-color: #dc3545; }
    .banner-primary { color: #fff; background-color: #007bff; border-color: #007bff; }
    .banner-secondary { color: #fff; background-color: #6c757d; border-color: #6c757d; }
    .banner-info { color: #000; background-color: #0dcaf0; border-color: #0dcaf0; }
    .banner-light { color: #000; background-color: rgb(250,250,250); border-color: rgb(220,220,220); }
    .banner-dark { color: #fff; background-color: #111; border-color: #111; }
    .banner-fuzzy { position: relative; color: #000; background-color: rgba(0,0,0,0.2); border: none; }
  `]
})
export class BannerComponent implements OnInit {
  @Input() guid: string;
  @Input() config: BannerConfig;

  animationState: string = 'void';
  location: string = '';
  alignment: string = '';
  theme: string = '';

  constructor(private service: AngularService) { }

  ngOnInit(): void {
    if (this.config) {
      this.location = this.getLocationClass();
      this.alignment = this.getAlignmentClass();
      this.theme = this.getThemeClass();
      this.config?.buttons?.forEach(btn => { btn.themeClass = this.getButtonThemeClass(btn); });
      if (this.config.onLoad) this.config.onLoad();
      this.animationState = 'fadeIn';
    }
  }

  onClick(btn: BannerButton) {
    if (btn) {
      let shouldContinue = false;
      if (btn.onClick) shouldContinue = btn.onClick();
      if (shouldContinue || btn.closeAfterClick) this.onClose();
    }
  }

  onClose(): void {
    this.config?.onClose?.();
    this.animationState = 'void';
    this.service.removeComponent(this.guid, BannerComponent);
  }

  private getLocationClass(): string {
    switch (this.config.location) {
      case BannerLocation.Top: return 'banner-top';
      case BannerLocation.Bottom: return 'banner-bottom';
      default: return '';
    }
  }
  private getThemeClass(): string {
    switch (this.config.theme) {
      case BannerThemeType.Success: return 'banner-success';
      case BannerThemeType.Warning: return 'banner-warning';
      case BannerThemeType.Danger: return 'banner-danger';
      case BannerThemeType.Primary: return 'banner-primary';
      case BannerThemeType.Secondary: return 'banner-secondary';
      case BannerThemeType.Info: return 'banner-info';
      case BannerThemeType.Light: return 'banner-light';
      case BannerThemeType.Dark: return 'banner-dark';
      default: return 'banner-fuzzy';
    }
  }
  private getAlignmentClass(): string {
    switch (this.config.contentAlignment) {
      case BannerContentAlignmentType.Left: return 'banner-content-left';
      case BannerContentAlignmentType.Center: return 'banner-content-center';
      case BannerContentAlignmentType.Right: return 'banner-content-right';
      case BannerContentAlignmentType.SpaceBetween: return 'banner-content-between';
      default: return 'banner-content-left';
    }
  }
  private getButtonThemeClass(btn: BannerButton): string {
    if (btn.themeClass) return btn.themeClass;
    switch (btn.theme) {
      case BannerThemeType.Success: return 'btn-success';
      case BannerThemeType.Warning: return 'btn-warning';
      case BannerThemeType.Danger: return 'btn-danger';
      case BannerThemeType.Primary: return 'btn-primary';
      case BannerThemeType.Secondary: return 'btn-secondary';
      case BannerThemeType.Info: return 'btn-info';
      default: return 'btn-light';
    }
  }
}
