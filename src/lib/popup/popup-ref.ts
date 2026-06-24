/**
 * Handle provided to components hosted inside a popup (modal, widget, offcanvas,
 * or banner) via NgComponentOutlet. Lets the hosted component close its own
 * popup without needing to know its guid. Inject it optionally:
 *
 *   private popupRef = inject(PopupRef, { optional: true });
 *   ...
 *   this.popupRef?.close();
 */
export class PopupRef {
  constructor(private readonly closeFn: () => void) { }

  close(): void { this.closeFn(); }
}
