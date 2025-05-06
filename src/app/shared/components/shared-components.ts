import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './buttons/button/button.component';
import { UserDropdownComponent } from './dropdowns/user-dropdown/user-dropdown.component';

export const sharedFormComponents = [ButtonComponent, FormsModule, ReactiveFormsModule, UserDropdownComponent];
