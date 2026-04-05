import { Injectable } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { ModalComponent } from './modal/modal.component';
import { WidgetComponent } from './widget/widget.component';
import { OffcanvasComponent } from './offcanvas/offcanvas.component';
import { PopupHostComponent } from './popup-host.component';
import {
  AlertModalConfig, BannerConfig, BannerContentAlignmentType, BannerLocation, BannerThemeType,
  ComponentModalConfig, ConfirmModalConfig, ImageModalConfig, ModalType,
  OffcanvasConfig, ToastConfig, ToastThemeType, WidgetConfig
} from './popup.models';
import { AngularService } from './angular.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class PopupService {

  public modalCacheKey(guid: string): string { return `M-${guid}`; }
  public widgetCacheKey(guid: string): string { return `W-${guid}`; }
  public bannerCacheKey(guid: string): string { return `B-${guid}`; }
  public offcanvasCacheKey(guid: string): string { return `O-${guid}`; }
  public cache: Map<string, any> = new Map<string, any>();

  constructor(private service: AngularService, private toastService: ToastService) {
    this.service.addComponent('popup-host', PopupHostComponent);
  }

  // ── Toast ──────────────────────────────────────────

  public toast(config: ToastConfig) {
    this.toastService.addToast(config);
  }
  public toastSuccess(message: string, timeout: number = 3000, onClose?: () => void) {
    this.toast(new ToastConfig({ theme: ToastThemeType.Success, icon: 'bi bi-check-circle-fill', message, timeout, onClose }));
  }
  public toastWarning(message: string, timeout: number = 3000, onClose?: () => void) {
    this.toast(new ToastConfig({ theme: ToastThemeType.Warning, icon: 'bi bi-exclamation-triangle-fill', message, timeout, onClose }));
  }
  public toastDanger(message: string, timeout: number = 3000, onClose?: () => void) {
    this.toast(new ToastConfig({ theme: ToastThemeType.Danger, icon: 'bi bi-x-circle-fill', message, timeout, onClose }));
  }
  public toastInfo(message: string, timeout: number = 3000, onClose?: () => void) {
    this.toast(new ToastConfig({ theme: ToastThemeType.Info, icon: 'bi bi-info-circle-fill', message, timeout, onClose }));
  }

  // ── Modal ──────────────────────────────────────────

  public modal(config: AlertModalConfig | ConfirmModalConfig | ComponentModalConfig | ImageModalConfig): string {
    if (config) {
      const guid = this.service.generateSimpleId();
      const modalType = this.getModalType(config);
      const inputs = [
        { key: 'guid', value: guid },
        { key: 'type', value: modalType },
        { key: 'config', value: config },
      ];
      this.service.addComponent(guid, ModalComponent, inputs);
      this.cache.set(this.modalCacheKey(guid), config);
      return guid;
    }
    return null;
  }
  public removeModal(guid: string) {
    this.service.removeComponent(guid, ModalComponent);
    const key = this.modalCacheKey(guid);
    if (this.cache.has(key)) {
      const config = this.cache.get(key);
      if (config?.onClose) config.onClose();
      this.cache.delete(key);
    }
  }
  public removeAllModals() {
    const prefix = this.modalCacheKey('');
    this.cache.forEach((v: any, k: string) => {
      if (k.startsWith(prefix)) {
        const guid = k.replace(prefix, '');
        this.service.removeComponent(guid, ModalComponent);
        if (v?.onClose) v.onClose();
        this.cache.delete(k);
      }
    });
  }

  // ── Widget ─────────────────────────────────────────

  public widget(config: WidgetConfig): string {
    if (config) {
      const guid = this.service.generateSimpleId();
      const inputs = [
        { key: 'guid', value: guid },
        { key: 'config', value: config },
      ];
      this.service.addComponent(guid, WidgetComponent, inputs);
      this.cache.set(this.widgetCacheKey(guid), config);
      return guid;
    }
    return null;
  }
  public removeWidget(guid: string) {
    this.service.removeComponent(guid, WidgetComponent);
    const key = this.widgetCacheKey(guid);
    if (this.cache.has(key)) {
      const config = this.cache.get(key);
      if (config?.onClose) config.onClose();
      this.cache.delete(key);
    }
  }
  public removeAllWidgets() {
    const prefix = this.widgetCacheKey('');
    this.cache.forEach((v: any, k: string) => {
      if (k.startsWith(prefix)) {
        const guid = k.replace(prefix, '');
        this.service.removeComponent(guid, WidgetComponent);
        if (v?.onClose) v.onClose();
        this.cache.delete(k);
      }
    });
  }

  // ── Banner ─────────────────────────────────────────

  public banner(config: BannerConfig): string {
    if (config) {
      const guid = this.service.generateSimpleId();
      const inputs = [
        { key: 'guid', value: guid },
        { key: 'config', value: config },
      ];
      this.service.addComponent(guid, BannerComponent, inputs);
      this.cache.set(this.bannerCacheKey(guid), config);
      return guid;
    }
    return null;
  }
  public bannerSaveDiscard(save: () => boolean, discard: () => boolean): string {
    return this.banner(new BannerConfig({
      location: BannerLocation.Bottom,
      contentAlignment: BannerContentAlignmentType.Right,
      message: 'You have pending changes... ',
      buttons: [
        { theme: BannerThemeType.Secondary, buttonText: 'Discard Changes', closeAfterClick: true, onClick: () => discard() },
        { theme: BannerThemeType.Success, buttonText: 'Save Changes', closeAfterClick: false, onClick: () => save() },
      ],
    }));
  }
  public removeBanner(guid: string) {
    this.service.removeComponent(guid, BannerComponent);
    const key = this.bannerCacheKey(guid);
    if (this.cache.has(key)) {
      const config = this.cache.get(key);
      if (config?.onClose) config.onClose();
      this.cache.delete(key);
    }
  }
  public removeAllBanners() {
    const prefix = this.bannerCacheKey('');
    this.cache.forEach((v: any, k: string) => {
      if (k.startsWith(prefix)) {
        const guid = k.replace(prefix, '');
        this.service.removeComponent(guid, BannerComponent);
        if (v?.onClose) v.onClose();
        this.cache.delete(k);
      }
    });
  }

  // ── Offcanvas ──────────────────────────────────────

  public offcanvas(config: OffcanvasConfig): string {
    if (config) {
      const guid = this.service.generateSimpleId();
      const inputs = [
        { key: 'guid', value: guid },
        { key: 'config', value: config },
      ];
      this.service.addComponent(guid, OffcanvasComponent, inputs);
      this.cache.set(this.offcanvasCacheKey(guid), config);
      return guid;
    }
    return null;
  }
  public removeOffcanvas(guid: string) {
    this.service.removeComponent(guid, OffcanvasComponent);
    const key = this.offcanvasCacheKey(guid);
    if (this.cache.has(key)) {
      const config = this.cache.get(key);
      if (config?.onClose) config.onClose();
      this.cache.delete(key);
    }
  }
  public removeAllOffcanvas() {
    const prefix = this.offcanvasCacheKey('');
    this.cache.forEach((v: any, k: string) => {
      if (k.startsWith(prefix)) {
        const guid = k.replace(prefix, '');
        this.service.removeComponent(guid, OffcanvasComponent);
        if (v?.onClose) v.onClose();
        this.cache.delete(k);
      }
    });
  }

  // ── Cleanup ────────────────────────────────────────

  public removeAllPopups(): void {
    this.removeAllModals();
    this.removeAllWidgets();
    this.removeAllBanners();
    this.removeAllOffcanvas();
  }

  private getModalType(config: AlertModalConfig | ConfirmModalConfig | ComponentModalConfig | ImageModalConfig): ModalType {
    if (config instanceof AlertModalConfig) return ModalType.Alert;
    if (config instanceof ConfirmModalConfig) return ModalType.Confirmation;
    if (config instanceof ComponentModalConfig) return ModalType.CustomComponent;
    if (config instanceof ImageModalConfig) return ModalType.Image;
    return ModalType.Alert;
  }
}
