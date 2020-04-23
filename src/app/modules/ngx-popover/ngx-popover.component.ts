import {Component, Input, ElementRef, AfterViewInit} from "@angular/core";

@Component({
  selector: "ngx-popover",
  templateUrl: "./ngx-popover.component.html",
})
export class NgxPopoverComponent implements AfterViewInit {
  public _top = -100000;
  public _left = -100000;
  public _isIn = false;
  public _isFaded = false;

  @Input() hostElm: HTMLElement;
  @Input() tooltipContent: string;
  @Input() placement: "top" | "bottom" | "left" | "right" = "bottom";
  @Input() isAnimated = true;

  constructor(private element: ElementRef) {}

  ngAfterViewInit(): void {
    this.show();
  }

  public show(): void {
    if (!this.hostElm) {
      return;
    }

    const positionElm = this.setElmPosition(
      this.hostElm,
      this.element.nativeElement.children[0],
      this.placement
    );

    this._top = positionElm.top;
    this._left = positionElm.left;
    this._isIn = true;

    if (this.isAnimated) {
      this._isFaded = true;
    }
  }

  public hide(): void {
    this.closeTooltip();
  }

  private setElmPosition(
    hostEl: HTMLElement,
    targetEl: HTMLElement,
    positionStr: string,
    appendToBody: boolean = false
  ): {
    top: number;
    left: number;
  } {
    const positionStrParts = positionStr.split("-");
    const pos0 = positionStrParts[0];
    const pos1 = positionStrParts[1] || "center";
    const hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);
    const targetElmWidth = targetEl.offsetWidth;
    const targetElmHeight = targetEl.offsetHeight;

    const shiftWidth: any = {
      center(): number {
        return hostElPos.left + hostElPos.width / 2 - targetElmWidth / 2;
      },
      left(): number {
        return hostElPos.left;
      },
      right(): number {
        return hostElPos.left + hostElPos.width;
      },
    };

    const shiftHeight: any = {
      center(): number {
        return hostElPos.top + hostElPos.height / 2 - targetElmHeight / 2;
      },
      top(): number {
        return hostElPos.top;
      },
      bottom(): number {
        return hostElPos.top + hostElPos.height;
      },
    };

    let targetElPos: {
      top: number;
      left: number;
    };

    switch (pos0) {
      case "right":
        return targetElPos = {
          top: shiftHeight[pos1](),
          left: shiftWidth[pos0](),
        };

      case "left":
        return targetElPos = {
          top: shiftHeight[pos1](),
          left: hostElPos.left - targetElmWidth,
        };

      case "bottom":
        return targetElPos = {
          top: shiftHeight[pos0](),
          left: shiftWidth[pos1](),
        };

      default:
        return targetElPos = {
          top: hostElPos.top - targetElmHeight,
          left: shiftWidth[pos1](),
        };
    }
  }

  private position(nativeEl: HTMLElement): {
    width: number;
    height: number;
    top: number;
    left: number
  } {
    const elBCR = this.offset(nativeEl);
    const offsetParentEl = this.parentOffsetElm(nativeEl);
    const boundingClientRect = nativeEl.getBoundingClientRect();

    let offsetParentBCR = {
      top: 0,
      left: 0,
    };

    if (offsetParentEl !== window.document) {
      offsetParentBCR = this.offset(offsetParentEl);
      offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
      offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
    }

    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: elBCR.top - offsetParentBCR.top,
      left: elBCR.left - offsetParentBCR.left,
    };
  }

  private offset(nativeEl: any): {
    width: number;
    height: number;
    top: number;
    left: number
  } {
    const boundingClientRect = nativeEl.getBoundingClientRect();

    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top:
        boundingClientRect.top + (window.pageYOffset || window.document.documentElement.scrollTop),
      left:
        boundingClientRect.left + (window.pageXOffset || window.document.documentElement.scrollLeft),
    };
  }

  private getStyle(nativeEl: HTMLElement, cssProp: string): string {
    if ((nativeEl as any).currentStyle) {
      return (nativeEl as any).currentStyle[cssProp];
    }

    if (window.getComputedStyle) {
      return (window.getComputedStyle(nativeEl) as any)[cssProp];
    }

    return (nativeEl.style as any)[cssProp];
  }

  private isPositionedStatic(nativeEl: HTMLElement): boolean {
    return (this.getStyle(nativeEl, "position") || "static") === "static";
  }

  private parentOffsetElm(nativeEl: HTMLElement): any {
    let offsetParent: any = nativeEl.offsetParent || window.document;

    while (
      offsetParent &&
      offsetParent !== window.document &&
      this.isPositionedStatic(offsetParent)
    ) {
      offsetParent = offsetParent.offsetParent;
    }

    return offsetParent || window.document;
  }

  public closeTooltip() {
    this._top = -100000;
    this._left = -100000;
    this._isIn = true;

    if (this.isAnimated) {
      this._isFaded = false;
    }
  }
}
