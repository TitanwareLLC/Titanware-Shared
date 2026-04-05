import { Injectable } from '@angular/core';
import { ModalConfigBase, ModalSize, ModalThemeType } from './popup.models';

@Injectable({ providedIn: 'root' })
export class ModalService {

  public getSizeClass(config: ModalConfigBase): string {
    switch (config.size) {
      case ModalSize.ExtraSmall: return 'modal-xsm';
      case ModalSize.Small: return 'modal-sm';
      case ModalSize.Medium: return 'modal-md';
      case ModalSize.Large: return 'modal-lg';
      case ModalSize.ExtraLarge: return 'modal-xlg';
      case ModalSize.Fullscreen: return 'modal-fullscreen';
      default: return 'modal-md';
    }
  }

  public getThemeClass(config: ModalConfigBase): string {
    switch (config.theme) {
      case ModalThemeType.Success: return 'modal-success';
      case ModalThemeType.Warning: return 'modal-warning';
      case ModalThemeType.Danger: return 'modal-danger';
      case ModalThemeType.Primary: return 'modal-primary';
      case ModalThemeType.Secondary: return 'modal-secondary';
      case ModalThemeType.Info: return 'modal-info';
      default: return '';
    }
  }

  public getThemeBtnClass(config: ModalConfigBase): string {
    switch (config.theme) {
      case ModalThemeType.Success: return 'btn-success';
      case ModalThemeType.Warning: return 'btn-warning';
      case ModalThemeType.Danger: return 'btn-danger';
      case ModalThemeType.Primary: return 'btn-primary';
      case ModalThemeType.Secondary: return 'btn-secondary';
      case ModalThemeType.Info: return 'btn-info';
      default: return 'btn-light';
    }
  }

  public getThemeSecondaryBtnClass(config: ModalConfigBase): string {
    switch (config.theme) {
      case ModalThemeType.Success: return 'btn-outline-success';
      case ModalThemeType.Warning: return 'btn-outline-warning';
      case ModalThemeType.Danger: return 'btn-outline-danger';
      case ModalThemeType.Primary: return 'btn-outline-primary';
      case ModalThemeType.Secondary: return 'btn-outline-secondary';
      case ModalThemeType.Info: return 'btn-outline-info';
      default: return 'btn-outline-light';
    }
  }

  public getThemeTextClass(config: ModalConfigBase): string {
    switch (config.theme) {
      case ModalThemeType.Success: return 'text-success';
      case ModalThemeType.Warning: return 'text-warning';
      case ModalThemeType.Danger: return 'text-danger';
      case ModalThemeType.Primary: return 'text-primary';
      case ModalThemeType.Secondary: return 'text-secondary';
      case ModalThemeType.Info: return 'text-info';
      default: return 'text-light';
    }
  }
}
