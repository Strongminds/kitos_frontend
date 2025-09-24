import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { ButtonComponent } from '../button/button.component';
import { NgClass, NgIf } from '@angular/common';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox-button',
  templateUrl: './checkbox-button.component.html',
  styleUrl: './checkbox-button.component.scss',
  imports: [TooltipComponent, ButtonComponent, NgClass, CheckboxComponent, NgIf],
})
export class CheckboxButtonComponent {
  @Input() value: boolean = false;
  @Input() disabled: boolean = false;
  @Input() backgroundWhite: boolean = false;
  @Input() isLarge: boolean = false;
  @Input() tooltip?: string;
  @Input() formName?: string;
  @Input() formGroup?: FormGroup;

  @Output() valueChange = new EventEmitter<boolean>();

  public onButtonClick(): void {
    this.value = !this.value;
    this.emitValue();
  }

  private emitValue(): void {
    this.valueChange.emit(this.value);
  }
}
