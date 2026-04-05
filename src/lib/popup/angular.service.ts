import { ApplicationRef, createComponent, EnvironmentInjector, Injectable, Type, ComponentRef, ElementRef } from '@angular/core';

interface ComponentEntry {
  key: string;
  ref: ComponentRef<unknown>;
}

@Injectable({ providedIn: 'root' })
export class AngularService {

  private componentRefs: ComponentEntry[] = [];

  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) { }

  public addComponent<T>(name: string, component: Type<T>, inputs: Array<{ key: string; value: any }> = [], containerOverride?: ElementRef): void {
    if (!name || !component) return;

    const componentRef = createComponent(component, { environmentInjector: this.injector });

    if (inputs?.length) {
      for (const input of inputs) {
        (componentRef.instance as any)[input.key] = input.value;
      }
    }

    this.appRef.attachView(componentRef.hostView);
    const hostElement = (componentRef.hostView as any).rootNodes[0] as HTMLElement;

    if (containerOverride) {
      containerOverride.nativeElement.appendChild(hostElement);
    } else {
      document.body.appendChild(hostElement);
    }

    this.componentRefs.push({ key: this.getKey(name, component), ref: componentRef });
  }

  public removeComponent(name: string, component: any): void {
    if (!name || !component) return;
    const key = this.getKey(name, component);
    const index = this.componentRefs.findIndex(x => x.key === key);
    if (index >= 0) {
      const entry = this.componentRefs.splice(index, 1)[0];
      this.appRef.detachView(entry.ref.hostView);
      entry.ref.destroy();
    }
  }

  public generateSimpleId(): string {
    return Math.random().toString(16).slice(2);
  }

  private getKey(name: string, component: Type<any> | { name?: string }): string {
    const componentName = (component as any).name || 'Unknown';
    return `${componentName}_${name}`;
  }
}
