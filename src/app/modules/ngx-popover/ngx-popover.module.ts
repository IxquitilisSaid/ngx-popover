import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxPopoverComponent } from "./ngx-popover.component";
import { NgxPopoverDirective } from "./ngx-popover.directive";

@NgModule({
  declarations: [NgxPopoverComponent, NgxPopoverDirective],
  imports: [CommonModule],
  exports: [NgxPopoverComponent, NgxPopoverDirective],
})
export class NgxPopoverModule {}
