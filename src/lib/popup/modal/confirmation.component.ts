import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmModalConfig, ModalConfigBase } from '../popup.models';
import { ModalService } from '../modal.service';

@Component({
  selector: 'popup-modal-confirmation',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (config?.showHeader) {
      <div class="modal-header {{ theme }}">
        @if (config.icon) { <i class="{{ config.icon }} me-1 mt-1"></i> }
        <h5 class="modal-title">{{ config?.title ?? '' }}</h5>
        <button title="Close" class="btn btn-close" (click)="close()"></button>
      </div>
    }
    <div class="modal-body">
      @if (config?.icon) {
        <div class="d-flex justify-content-center align-items-center mb-3 {{ txtTheme }}"><i class="{{ config.icon }}" style="font-size:3rem"></i></div>
      }
      <div [innerHTML]="config?.customMessage ? config.customMessage() : (config?.message ?? 'No Modal Message.')"></div>
      @if (config?.includeCheckbox) {
        <div class="d-flex flex-column justify-content-center align-items-center mt-3 mb-3">
          <div class="form-check pointer">
            <input class="form-check-input pointer" type="checkbox" [(ngModel)]="checkboxValue" id="acknowledgement" (change)="onChange()" />
            <label class="form-check-label pointer" for="acknowledgement">{{ config?.checkboxText ?? 'I Understand' }}</label>
          </div>
          @if (showCheckboxError) {
            <small class="text-danger">This checkbox is required.</small>
          }
        </div>
      }
    </div>
    <div class="modal-footer">
      <button class="w-50 me-2 btn {{ btnSecondaryTheme }}" (click)="close()">{{ config?.closeButtonText ?? 'Close' }}</button>
      <button class="w-50 ms-2 btn {{ btnTheme }}" (click)="confirm()">{{ config?.confirmButtonText ?? 'Confirm' }}</button>
    </div>
  `,
  styles: [`
    .modal-body { height: 100%; overflow-y: auto; display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .modal-header { display: flex; align-items: center; }
    .pointer { cursor: pointer; }
    .modal-success { color: #fff; background-color: #198754; border-color: #198754; }
    .modal-warning { color: #212529; background-color: #ffc107; border-color: #ffc107; }
    .modal-danger { color: #fff; background-color: #dc3545; border-color: #dc3545; }
    .modal-primary { color: #fff; background-color: #007bff; border-color: #007bff; }
    .modal-secondary { color: #fff; background-color: #6c757d; border-color: #6c757d; }
    .modal-info { color: #000; background-color: #0dcaf0; border-color: #0dcaf0; }
  `]
})
export class ConfirmationComponent {
  @Output() onClose = new EventEmitter<boolean>();
  @Output() onConfirm = new EventEmitter<boolean>();

  @Input() set setConfig(config: ModalConfigBase) {
    this._config = config as ConfirmModalConfig;
    this.setClasses();
  }
  get config(): ConfirmModalConfig { return this._config; }
  private _config: ConfirmModalConfig;

  theme: string = '';
  btnTheme: string = '';
  btnSecondaryTheme: string = '';
  txtTheme: string = '';
  showCheckboxError: boolean = false;
  checkboxValue: boolean = false;

  constructor(private modalService: ModalService) { }

  close(): void { this.onClose.emit(true); }

  confirm(): void {
    if (this.config?.includeCheckbox && !this.checkboxValue) {
      this.showCheckboxError = true;
      return;
    }
    this.onConfirm.emit(true);
  }

  onChange(): void { this.showCheckboxError = !this.checkboxValue; }

  private setClasses(): void {
    this.theme = this.modalService.getThemeClass(this.config);
    this.btnTheme = this.modalService.getThemeBtnClass(this.config);
    this.btnSecondaryTheme = this.modalService.getThemeSecondaryBtnClass(this.config);
    this.txtTheme = this.modalService.getThemeTextClass(this.config);
  }
}
