import { Component, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { BaseFormComponent } from '../../base/base-form.component';
import { DEFAULT_DATE_FORMAT } from '../../constants';

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
})
export class DatePickerComponent extends BaseFormComponent<Date | undefined> {
  @Input() public icon?: 'search';
  @Input() public size: 'small' | 'large' = 'large';

  @Input() override value = new Date();

  public readonly DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT;

  public formDateInputValueChange(event: MatDatepickerInputEvent<moment.Moment, unknown>) {
    const newValue: Date | undefined = event.value ? moment(event.value).toDate() : undefined;
    super.formValueChange(newValue);
  }
}
