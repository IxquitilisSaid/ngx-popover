import {
  Directive,
  ComponentRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  Input,
  HostListener,
} from "@angular/core";
import { NgxPopoverComponent } from "./ngx-popover.component";

@Directive({
  selector: "[ngx-popover]",
})
export class NgxPopoverDirective {
  private _tooltip: ComponentRef<NgxPopoverComponent>;
  private isVisible: boolean;

  @Input("ngx-popover") tooltipContent: string | NgxPopoverComponent;
  @Input() tooltipDisabled: boolean;
  @Input() tooltipAnimation = true;
  @Input() tooltipPlacement: "top" | "bottom" | "left" | "right" = "bottom";
  @Input() focusEventsEnabled: boolean = true;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {}

  @HostListener("focusin") onFocusIn() {
    if (this.focusEventsEnabled === true) {
      this.show();
    }
  }

  @HostListener("mouseenter") onMouseEnter() {
    this.show();
  }

  @HostListener("focusout") onFocusOut() {
    if (this.focusEventsEnabled === true) {
      this.hide();
    }
  }

  @HostListener("mouseleave") onMouseLeave() {
    this.hide();
  }

  public show(): void {
    if (this.tooltipDisabled || this.isVisible) {
      return;
    }

    this.isVisible = true;

    if (typeof this.tooltipContent === "string") {
      const factory = this.resolver.resolveComponentFactory(NgxPopoverComponent);

      if (!this.isVisible) {
        return;
      }

      this._tooltip = this.viewContainerRef.createComponent(factory);

      this._tooltip.instance.hostElm = this.viewContainerRef.element.nativeElement;
      this._tooltip.instance.tooltipContent = this.tooltipContent as string;
      this._tooltip.instance.placement = this.tooltipPlacement;
      this._tooltip.instance.isAnimated = this.tooltipAnimation;
    } else {
      const tooltip = this.tooltipContent as NgxPopoverComponent;

      tooltip.hostElm = this.viewContainerRef.element.nativeElement;
      tooltip.placement = this.tooltipPlacement;
      tooltip.isAnimated = this.tooltipAnimation;

      tooltip.show();
    }
  }

  public hide(): void {
    if (!this.isVisible) {
      return;
    }

    this.isVisible = false;

    if (this._tooltip) {
      this._tooltip.destroy();
    }

    if (this.tooltipContent instanceof NgxPopoverComponent) {
      (this.tooltipContent as NgxPopoverComponent).hide();
    }
  }
}
