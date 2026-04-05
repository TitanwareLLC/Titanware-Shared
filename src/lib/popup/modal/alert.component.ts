import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertModalConfig, ModalConfigBase } from '../popup.models';
import { ModalService } from '../modal.service';

@Component({
  selector: 'popup-modal-alert',
  standalone: true,
  template: `
    @if (config?.showHeader) {
      <div class="modal-header {{ theme }}">
        @if (config.icon) { <i class="{{ config.icon }} me-1 mt-1"></i> }
        <h5 class="modal-title">{{ config?.title ?? 'Modal Title' }}</h5>
        <button title="Close" class="btn btn-close" (click)="close()"></button>
      </div>
    }
    <div class="modal-body">
      @if (config?.icon && config?.showIconInBody) {
        <div class="d-flex justify-content-center align-items-center mb-3 {{ txtTheme }}"><i class="{{ config.icon }}" style="font-size:3rem"></i></div>
      }
      <div [innerHTML]="config?.customMessage ? config.customMessage() : (config?.message ?? 'No Modal Message.')"></div>
    </div>
    @if (config?.showFooter) {
      <div class="modal-footer">
        <button class="btn w-100 {{ btnTheme }}" (click)="close()">{{ config?.buttonText ?? 'Close' }}</button>
      </div>
    }
  `,
  styles: [`
    .modal-body { height: 100%; overflow-y: auto; }
    .modal-success { color: #fff; background-color: #198754; border-color: #198754; }
    .modal-warning { color: #212529; background-color: #ffc107; border-color: #ffc107; }
    .modal-danger { color: #fff; background-color: #dc3545; border-color: #dc3545; }
    .modal-primary { color: #fff; background-color: #007bff; border-color: #007bff; }
    .modal-secondary { color: #fff; background-color: #6c757d; border-color: #6c757d; }
    .modal-info { color: #000; background-color: #0dcaf0; border-color: #0dcaf0; }
  `]
})
export class AlertComponent {
  @Output() onClose = new EventEmitter<boolean>();

  @Input() set setConfig(config: ModalConfigBase) {
    this._config = config as AlertModalConfig;
    this.setClasses();
  }
  get config(): AlertModalConfig { return this._config; }
  private _config: AlertModalConfig;

  theme: string = '';
  btnTheme: string = '';
  txtTheme: string = '';

  constructor(private modalService: ModalService) { }

  close(): void { this.onClose.emit(true); }

  private setClasses(): void {
    this.theme = this.modalService.getThemeClass(this.config);
    this.btnTheme = this.modalService.getThemeBtnClass(this.config);
    this.txtTheme = this.modalService.getThemeTextClass(this.config);
  }
}
