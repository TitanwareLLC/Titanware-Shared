import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { OffcanvasConfig, OffcanvasLocation } from '../popup.models';
import { AngularService } from '../angular.service';

const fadeInOutAnimation = trigger('fadeInOut', [
  state('x-void', style({ width: 0 })),
  state('y-void', style({ height: 0 })),
  state('fadeIn', style({})),
  transition('x-void => fadeIn', [animate('300ms ease-in')]),
  transition('fadeIn => x-void', [animate('300ms ease-out')]),
  transition('y-void => fadeIn', [animate('300ms ease-in')]),
  transition('fadeIn => y-void', [animate('300ms ease-out')])
]);

@Component({
  selector: 'popup-offcanvas',
  standalone: true,
  animations: [fadeInOutAnimation],
  template: `
    @if (config) {
      <div #offcanvasEl class="offcanvas resize-offcanvas show {{ location }}"
           [@fadeInOut]="animationState"
           [style.width.px]="width"
           tabindex="-1">
        <div class="resize-container">
          @if (isReady) {
            <div class="offcanvas-header bg-light border shadow-sm">
              @if (config.icon) { <i class="{{ config.icon }} me-1 mt-1"></i> }
              @if (config?.title) { <h5 class="offcanvas-title">{{ config.title }}</h5> }
              <button type="button" class="btn-close" (click)="onClose()"></button>
            </div>
            <div class="offcanvas-body"></div>
          }
          @if (config.location === locations.Left) {
            <div class="resize-handle resize-handle-right" (mousedown)="onResizeMouseDown($event)"></div>
          }
          @if (config.location === locations.Right) {
            <div class="resize-handle resize-handle-left" (mousedown)="onResizeMouseDown($event)"></div>
          }
        </div>
      </div>
      <div class="offcanvas-backdrop fade show" [class.no-fuzz]="!config?.fuzzyBackground" (click)="onBackdropClick()"></div>
    }
  `,
  styles: [`
    .no-fuzz { background-color: transparent !important; pointer-events: auto !important; }
    .resize-offcanvas { width: 400px; max-width: 100vw; }
    .resize-container { position: relative; width: 100%; height: 100%; }
    .offcanvas-body { height: 100%; overflow-y: auto; }
    .resize-handle { position: absolute; top: 0; width: 6px; height: 100%; cursor: ew-resize; z-index: 2; background-color: transparent; }
    .resize-handle:hover { background-color: rgba(0, 0, 0, 0.05); }
    .resize-handle-left { left: 0; }
    .resize-handle-right { right: 0; }
  `]
})
export class OffcanvasComponent implements OnInit, OnDestroy {
  @Input() guid: string;
  @Input() config: OffcanvasConfig;
  @ViewChild('offcanvasEl', { static: true }) offcanvasEl!: ElementRef<HTMLElement>;

  animationState: string | null = null;
  location: string = '';
  isReady: boolean = false;
  locations = OffcanvasLocation;
  width = 400;
  private minWidth = 400;
  private get maxWidth() { return window.innerWidth; }
  private isResizing = false;
  private startX = 0;
  private startWidth = 0;

  constructor(private service: AngularService) { }

  ngOnInit(): void {
    if (this.config) {
      this.animationState = this.getStartAnimationState();
      setTimeout(() => {
        this.location = this.getLocationClass();
        if (this.config.onLoad) this.config.onLoad();
        this.animationState = 'fadeIn';
        setTimeout(() => { this.isReady = true; }, 300);
      }, 100);
    }
  }

  async onClose(): Promise<void> {
    if (this.config.onCloseIf && !this.config.onCloseIf()) return;
    if (this.config.onCloseIfAsync && !(await this.config.onCloseIfAsync())) return;
    if (this.config.onClose) this.config.onClose();
    this.isReady = false;
    this.animationState = this.getStartAnimationState();
    setTimeout(() => this.service.removeComponent(this.guid, OffcanvasComponent), 300);
  }

  onBackdropClick(): void {
    if (this.config?.closeOnOuterClick) this.onClose();
  }

  ngOnDestroy(): void { }

  onResizeMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = this.width || this.offcanvasEl.nativeElement.offsetWidth;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isResizing) return;
    const dx = this.config.location === OffcanvasLocation.Right ? this.startX - event.clientX : event.clientX - this.startX;
    this.width = Math.max(this.minWidth, Math.min(this.maxWidth, this.startWidth + dx));
  }

  @HostListener('window:mouseup')
  onMouseUp(): void { if (this.isResizing) this.isResizing = false; }

  private getLocationClass(): string {
    switch (this.config.location) {
      case OffcanvasLocation.Top: return 'offcanvas-top';
      case OffcanvasLocation.Right: return 'offcanvas-end';
      case OffcanvasLocation.Bottom: return 'offcanvas-bottom';
      default: return 'offcanvas-start';
    }
  }
  private getStartAnimationState(): string {
    return this.config.location === OffcanvasLocation.Top || this.config.location === OffcanvasLocation.Bottom ? 'y-void' : 'x-void';
  }
}
