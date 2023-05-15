import { AfterViewInit, Component, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import IMask from 'imask';
import { BaseFormComponent } from '../../base/base-form.component';
import { INT_MAX_VALUE } from '../../constants';

@Component({
  selector: 'app-numeric-input',
  templateUrl: './numeric-input.component.html',
  styleUrls: ['./numeric-input.component.scss'],
})
export class NumericInputComponent extends BaseFormComponent<number | undefined> implements AfterViewInit, OnDestroy {
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() public minLength = 0;
  @Input() public maxLength = INT_MAX_VALUE;
  @Input() public numberType: 'integer' | undefined = 'integer';

  @ViewChild('input', { read: ViewContainerRef }) public input!: ViewContainerRef;

  override formInputValueChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const newValue = this.convertEventValueToNumber(value);
    super.formValueChange(newValue);
  }

  public inputChanged(value: string) {
    const newValue = this.convertEventValueToNumber(value);
    this.valueChange.emit(newValue);
  }

  public ngAfterViewInit(): void {
    if (!this.disabled && !this.formGroup?.controls[this.formName ?? '']?.disabled) {
      setTimeout(() => {
        IMask(this.input.element.nativeElement, {
          mask: Number,
          scale: this.numberType === 'integer' ? 0 : 0,
          min: this.minLength,
          max: this.maxLength,
        });
      });
    }
  }

  private convertEventValueToNumber(eventValue: string): number {
    //ensures that no other values than numbers and optionally a coma is not returned
    const valuesToPreserveRegex = this.numberType === 'integer' ? /[^0-9]/g : /[^0-9,]/g;
    const newValue = eventValue.replace(valuesToPreserveRegex, '');
    return newValue as unknown as number;
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
