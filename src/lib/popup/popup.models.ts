// ── Toast ──────────────────────────────────────────────────────────

export class ToastConfig {
  constructor(options?: Partial<ToastConfig>) {
    this.timeout = 3000;
    if (options) Object.assign(this, options);
  }

  public message: string;
  public theme?: ToastThemeType;
  public icon?: string;
  public timeout?: number;
  public onLoad?: () => void;
  public onClose?: () => void;
}

export enum ToastThemeType {
  Default,
  Primary,
  Secondary,
  Info,
  Success,
  Warning,
  Danger
}

// ── Modal ──────────────────────────────────────────────────────────

export class ModalConfigBase {
  constructor() {
    this.size = ModalSize.Medium;
    this.showHeader = true;
    this.showFooter = true;
    this.closeOnOuterClick = false;
    this.fuzzyBackground = false;
  }

  public title?: string;
  public theme?: ModalThemeType;
  public icon?: string;
  public size?: ModalSize;
  public showHeader?: boolean;
  public showFooter?: boolean;
  public showIconInBody?: boolean;
  public closeOnOuterClick?: boolean;
  public fuzzyBackground?: boolean;
  public onLoad?: () => void;
  public onClose?: () => void;
}

export enum ModalType {
  Alert,
  Confirmation,
  CustomComponent,
  Image
}

export enum ModalThemeType {
  Default,
  Primary,
  Secondary,
  Info,
  Success,
  Warning,
  Danger
}

export enum ModalSize {
  ExtraSmall,
  Small,
  Medium,
  Large,
  ExtraLarge,
  Fullscreen
}

export class AlertModalConfig extends ModalConfigBase {
  constructor(options?: Partial<AlertModalConfig>) {
    super();
    if (options) Object.assign(this, options);
  }

  public message?: string;
  public customMessage?: () => string;
  public buttonText?: string;
}

export class ConfirmModalConfig extends ModalConfigBase {
  constructor(options?: Partial<ConfirmModalConfig>) {
    super();
    if (options) Object.assign(this, options);
  }

  public message?: string;
  public customMessage?: () => string;
  public closeButtonText?: string;
  public confirmButtonText?: string;
  public includeCheckbox?: boolean;
  public checkboxText?: string;
  public onConfirm?: () => void;
}

export class ComponentModalConfig extends ModalConfigBase {
  constructor(options?: Partial<ComponentModalConfig>) {
    super();
    if (options) Object.assign(this, options);
  }

  public component: any;
  public buttonText?: string;
}

export class ImageModalConfig extends ModalConfigBase {
  constructor(options?: Partial<ImageModalConfig>) {
    super();
    if (options) Object.assign(this, options);
  }

  public imageSource: string;
}

// ── Banner ─────────────────────────────────────────────────────────

export class BannerConfig {
  constructor(options?: Partial<BannerConfig>) {
    this.location = BannerLocation.Top;
    this.contentAlignment = BannerContentAlignmentType.Left;
    this.theme = BannerThemeType.Default;
    this.buttons = [];
    if (options) Object.assign(this, options);
  }

  public location?: BannerLocation;
  public contentAlignment?: BannerContentAlignmentType;
  public theme?: BannerThemeType;
  public component?: any;
  public message?: string;
  public buttons?: Array<BannerButton>;
  public onLoad?: () => void;
  public onClose?: () => void;
}

export class BannerButton {
  public theme?: BannerThemeType;
  public themeClass?: string;
  public buttonText?: string;
  public onClick?(): boolean;
  public closeAfterClick?: boolean;
}

export enum BannerLocation { Top, Bottom }
export enum BannerContentAlignmentType { Left, Center, Right, SpaceBetween }
export enum BannerThemeType { Default, Primary, Secondary, Info, Success, Warning, Danger, Light, Dark }

// ── Offcanvas ──────────────────────────────────────────────────────

export class OffcanvasConfig {
  constructor(options?: Partial<OffcanvasConfig>) {
    this.location = OffcanvasLocation.Left;
    if (options) Object.assign(this, options);
  }

  public icon?: string;
  public title?: string;
  public location?: OffcanvasLocation;
  public component?: any;
  public message?: string;
  public fuzzyBackground?: boolean;
  public closeOnOuterClick?: boolean;
  public onLoad?: () => void;
  public onClose?: () => void;
  public onCloseIf?: () => boolean;
  public onCloseIfAsync?: () => Promise<boolean>;
}

export enum OffcanvasLocation { Left, Top, Right, Bottom }

// ── Widget ─────────────────────────────────────────────────────────

export class WidgetConfig {
  constructor(options?: Partial<WidgetConfig>) {
    this.location = WidgetLocation.BottomRight;
    this.maximizeTheme = WidgetThemeType.Default;
    this.minimizeTheme = WidgetThemeType.Primary;
    this.size = WidgetSize.Small;
    if (options) Object.assign(this, options);
  }

  public component: any;
  public location?: WidgetLocation;
  public maximizeTheme?: WidgetThemeType;
  public minimizeTheme?: WidgetThemeType;
  public size?: WidgetSize;
  public minimizeIcon?: string;
  public maximizeIcon?: string;
  public title?: string;
  public onMaximize?: () => void;
  public onMinimize?: () => void;
  public onLoad?: () => void;
  public onClose?: () => void;
}

export enum WidgetLocation { TopLeft, TopRight, BottomLeft, BottomRight }
export enum WidgetThemeType { Default, Primary, Secondary, Info, Success, Warning, Danger }
export enum WidgetSize { ExtraSmall, Small, Medium, Large, ExtraLarge, NearlyFullscreen }
