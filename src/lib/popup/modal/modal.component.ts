import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ConfirmModalConfig, ModalConfigBase, ModalType } from '../popup.models';
import { ModalService } from '../modal.service';
import { PopupService } from '../popup.service';
import { AlertComponent } from './alert.component';
import { ConfirmationComponent } from './confirmation.component';

@Component({
  selector: 'popup-modal',
  standalone: true,
  imports: [AlertComponent, ConfirmationComponent],
  templateUrl: './modal.component.html',
  styles: [`
    :host { display: block; }
    .dark-overlay { position: fixed; z-index: 98; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.55); }
    .click-overlay { position: fixed; z-index: 99; top: 0; bottom: 0; left: 0; right: 0; }
    .modal-cntr { display: flex; justify-content: center; align-items: center; z-index: 1097; position: fixed; top: 0; bottom: 0; left: 0; right: 0; opacity: 0; transition: opacity 300ms ease-in; }
    :host(.show) .modal-cntr { opacity: 1; }
    .modal-cntr .modal { position: relative; display: flex; }
    .modal-cntr .modal-content { z-index: 2000; height: 100%; }
    .modal-cntr .modal-content .modal-header i { margin-top: 0.25rem; }
    @media(max-width: 1000px) { .modal { width: 98% !important; } }
    .modal-xsm { width: 20%; height: 35%; max-height: 35%; margin-bottom: 24%; }
    .modal-sm { width: 30%; height: 40%; max-height: 40%; margin-bottom: 22%; }
    .modal-md { width: 45%; height: 65%; max-height: 65%; margin-bottom: 12%; }
    .modal-lg { width: 78%; height: 85%; max-height: 85%; }
    .modal-xlg { width: 97%; height: 95%; max-height: 95%; }
    .modal-fullscreen { width: 100%; height: 100%; }
  `]
})
export class ModalComponent implements OnInit {
  @Input() guid: string;
  @Input() type: ModalType;
  @Input() set config(config: ModalConfigBase) {
    this._config = config;
    this.setSizeClass();
  }
  get config(): ModalConfigBase { return this._config; }
  private _config: ModalConfigBase;

  modalTypes = ModalType;
  size: string = '';

  constructor(private popupService: PopupService, private modalService: ModalService, private elRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    if (this.config) {
      if (this.config.onLoad) this.config.onLoad();
      requestAnimationFrame(() => this.elRef.nativeElement.classList.add('show'));
    }
  }

  close() {
    this.elRef.nativeElement.classList.remove('show');
    setTimeout(() => this.popupService.removeModal(this.guid), 300);
  }

  confirm() {
    const config = this.config as ConfirmModalConfig;
    if (config?.onConfirm) config.onConfirm();
    this.close();
  }

  private setSizeClass(): void {
    this.size = this.modalService.getSizeClass(this.config);
  }
}
