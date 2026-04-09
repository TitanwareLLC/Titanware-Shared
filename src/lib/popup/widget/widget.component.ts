import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { WidgetConfig, WidgetLocation, WidgetSize, WidgetThemeType } from '../popup.models';
import { AngularService } from '../angular.service';

@Component({
  selector: 'popup-widget',
  standalone: true,
  template: `
    @if (config) {
      <div class="widget-cntr {{ location }}">
        <div class="{{ size }}" [class.hidden]="!isOpen && !isOpening">
          <div class="card {{ max }} shadow-lg" [class.maximized]="(isOpen || isOpening) && !isClosing">
            <div class="card-header">
              <div class="d-flex align-items-center">
                @if (config?.maximizeIcon) { <i class="{{ config.maximizeIcon }} me-2"></i> }
                @if (config?.title) { <strong>{{ config.title }}</strong> }
                <button class="btn btn-close ms-auto" (click)="onMinimize()"></button>
              </div>
            </div>
            <div class="card-body"></div>
          </div>
        </div>
        <div class="card card-mini {{ min }} shadow-lg" [class.hidden]="isOpen || isOpening" (click)="onMaximize()">
          <div class="card-body d-flex align-items-center justify-content-center p-0">
            @if (config?.minimizeIcon) { <i class="{{ config.minimizeIcon }}"></i> }
          </div>
        </div>
        @if (!isOpen && !isOpening) {
          <button class="btn btn-close btn-mini" (click)="onCloseWidget()"></button>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .widget-cntr { display: flex; justify-content: center; z-index: 97; position: fixed; padding: 1rem; opacity: 0; transition: opacity 300ms ease-in; }
    :host(.show) .widget-cntr { opacity: 1; }
    .widget-cntr .card { z-index: 100; transition: border-radius 300ms ease-in, min-height 300ms ease-in, min-width 300ms ease-in, max-height 300ms ease-in, max-width 300ms ease-in; border-radius: 50%; min-height: 4rem; min-width: 4rem; max-height: 4rem; max-width: 4rem; }
    .widget-cntr .card.maximized { border-radius: 0; min-height: 100%; min-width: 100%; max-height: 100%; max-width: 100%; }
    .widget-top-left { top: 0; left: 0; }
    .widget-top-right { top: 0; right: 0; }
    .widget-bottom-left { bottom: 0; left: 0; }
    .widget-bottom-right { bottom: 0; right: 0; }
    .card-mini { cursor: pointer; border-radius: 50%; width: 4rem; height: 4rem; }
    .card-mini .card-body { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; }
    .card-mini .card-body i { width: auto; height: auto; }
    .btn-mini { display: none; position: absolute; top: 8px; right: 8px; width: 0.25em; height: 0.25em; }
    .widget-cntr:hover .btn-mini { display: block; }
    .hidden { display: none !important; }
    .widget-success { color: #fff; background-color: #198754; border-color: #198754; }
    .widget-warning { color: #000; background-color: #ffc107; border-color: #ffc107; }
    .widget-danger { color: #fff; background-color: #dc3545; border-color: #dc3545; }
    .widget-primary { color: #fff; background-color: #007bff; border-color: #007bff; }
    .widget-secondary { color: #fff; background-color: #6c757d; border-color: #6c757d; }
    .widget-info { color: #000; background-color: #0dcaf0; border-color: #0dcaf0; }
    .widget-xsm { min-width: 8vw; min-height: 25vh; max-width: 8vw; max-height: 25vh; }
    .widget-sm { min-height: 30vh; min-width: 10vw; max-height: 30vh; max-width: 10vw; }
    .widget-md { min-height: 40vh; min-width: 20vw; max-height: 40vh; max-width: 20vw; }
    .widget-lg { min-height: 65vh; min-width: 30vw; max-height: 65vh; max-width: 30vw; }
    .widget-xlg { min-height: 85vh; min-width: 40vw; max-height: 85vh; max-width: 40vw; }
    .widget-fullscreen { min-height: calc(100vh - 2rem); min-width: calc(100vw - 2rem); max-height: calc(100vh - 2rem); max-width: calc(100vw - 2rem); }
  `]
})
export class WidgetComponent implements OnInit {
  @Input() guid: string;
  @Input() set config(config: WidgetConfig) {
    this._config = config;
    this.setClasses();
  }
  get config(): WidgetConfig { return this._config; }
  private _config: WidgetConfig;

  isOpen: boolean = false;
  isOpening: boolean = false;
  isClosing: boolean = false;
  location: string = '';
  size: string = '';
  max: string = '';
  min: string = '';

  constructor(private service: AngularService, private elRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    if (this.config) {
      if (this.config.onLoad) this.config.onLoad();
      requestAnimationFrame(() => this.elRef.nativeElement.classList.add('show'));
    }
  }

  onMaximize() {
    if (!this.isOpen) {
      if (this.config?.onMaximize) this.config.onMaximize();
      this.isOpening = true;
      setTimeout(() => { this.isOpening = false; this.isOpen = true; }, 500);
    }
  }

  onMinimize() {
    if (this.isOpen) {
      if (this.config?.onMinimize) this.config.onMinimize();
      this.isClosing = true;
      setTimeout(() => { this.isOpen = false; this.isClosing = false; }, 300);
    }
  }

  onCloseWidget() {
    if (this.config?.onClose) this.config.onClose();
    this.elRef.nativeElement.classList.remove('show');
    setTimeout(() => this.service.removeComponent(this.guid, WidgetComponent), 500);
  }

  private setClasses(): void {
    this.location = this.getLocationClass();
    this.size = this.getSizeClass();
    this.max = this.getThemeClass(this.config.maximizeTheme);
    this.min = this.getThemeClass(this.config.minimizeTheme);
  }
  private getLocationClass(): string {
    switch (this.config.location) {
      case WidgetLocation.TopLeft: return 'widget-top-left';
      case WidgetLocation.TopRight: return 'widget-top-right';
      case WidgetLocation.BottomLeft: return 'widget-bottom-left';
      case WidgetLocation.BottomRight: return 'widget-bottom-right';
      default: return 'widget-bottom-right';
    }
  }
  private getSizeClass(): string {
    switch (this.config.size) {
      case WidgetSize.ExtraSmall: return 'widget-xsm';
      case WidgetSize.Small: return 'widget-sm';
      case WidgetSize.Medium: return 'widget-md';
      case WidgetSize.Large: return 'widget-lg';
      case WidgetSize.ExtraLarge: return 'widget-xlg';
      case WidgetSize.NearlyFullscreen: return 'widget-fullscreen';
      default: return 'widget-md';
    }
  }
  private getThemeClass(type: WidgetThemeType): string {
    switch (type) {
      case WidgetThemeType.Success: return 'widget-success';
      case WidgetThemeType.Warning: return 'widget-warning';
      case WidgetThemeType.Danger: return 'widget-danger';
      case WidgetThemeType.Primary: return 'widget-primary';
      case WidgetThemeType.Secondary: return 'widget-secondary';
      case WidgetThemeType.Info: return 'widget-info';
      default: return '';
    }
  }
}
