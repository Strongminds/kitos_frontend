import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { ButtonComponent } from './buttons/button/button.component';
import { DropdownComponent } from './dropdowns/dropdown/dropdown.component';
import { MultiSelectDropdownComponent } from './dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { UserDropdownComponent } from './dropdowns/user-dropdown/user-dropdown.component';
import { ParagraphComponent } from './paragraph/paragraph.component';
import { TextBoxInfoComponent } from './textbox-info/textbox-info.component';

export const sharedFormComponents = [
  ButtonComponent,
  FormsModule,
  ReactiveFormsModule,
  UserDropdownComponent,
  DropdownComponent,
  TextBoxComponent,
  DatePickerComponent,
  ParagraphComponent,
  MultiSelectDropdownComponent,
  TextBoxInfoComponent,
];
