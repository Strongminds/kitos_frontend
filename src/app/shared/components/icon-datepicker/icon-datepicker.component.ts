import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule, provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-icon-datepicker',
  templateUrl: './icon-datepicker.component.html',
  styleUrl: './icon-datepicker.component.scss',
  imports: [
    FormsModule,
    MatMenu,
    MatMenuTrigger,
    ReactiveFormsModule,
    MatIcon,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
  providers: [
    provideMomentDateAdapter(),
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['DD-MM-yyyy', 'DDMMyyyy'],
        },
        display: {
          dateInput: 'DD-MM-yyyy',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
})
export class IconDatepickerComponent {
  selectedDate: Date | null = null;

  @Output() dateChange = new EventEmitter<Date>();

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.dateChange.emit(date);
  }
}
