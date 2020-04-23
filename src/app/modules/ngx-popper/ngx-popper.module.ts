import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPopperComponent } from './ngx-popper.component';
import { NgxPopperDirective } from './ngx-popper.directive';



@NgModule({
  declarations: [NgxPopperComponent, NgxPopperDirective],
  imports: [
    CommonModule
  ]
})
export class NgxPopperModule { }
