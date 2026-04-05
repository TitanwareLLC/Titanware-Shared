import { ElementRef, Injectable } from '@angular/core';
import { ToastComponent } from './toast/toast.component';
import { ToastConfig } from './popup.models';
import { AngularService } from './angular.service';

@Injectable({ providedIn: 'root' })
export class ToastService {

  private _configs: Array<{ key: string; value: ToastConfig }> = [];
  public get configs() { return this._configs; }

  public container: ElementRef;

  constructor(private service: AngularService) { }

  public addToast(config: ToastConfig): void {
    if (config) {
      const guid = this.service.generateSimpleId();
      const inputs = [
        { key: 'guid', value: guid },
        { key: 'config', value: config },
      ];
      this._configs.push({ key: guid, value: config });
      this.service.addComponent(guid, ToastComponent, inputs, this.container);
    }
  }

  public removeToast(guid: string): void {
    if (guid) {
      this._configs = this._configs.filter(x => x.key !== guid);
      this.service.removeComponent(guid, ToastComponent);
    }
  }
}
