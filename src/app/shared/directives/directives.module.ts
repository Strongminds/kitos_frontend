import { NgModule } from '@angular/core';
import { AfterValueChangedDirective } from './after-value-changed.directive';
import { HideInProdDirective } from './hide-in-prod.directive';
import { CtrlClickDirective } from './ctrl-click.directive';

@NgModule({
  declarations: [AfterValueChangedDirective, HideInProdDirective, CtrlClickDirective],
  exports: [AfterValueChangedDirective, HideInProdDirective, CtrlClickDirective],
})
export class DirectivesModule {}
