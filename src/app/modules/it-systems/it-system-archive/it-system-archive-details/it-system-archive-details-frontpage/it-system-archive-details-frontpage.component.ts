import { Component } from '@angular/core';
import { CardComponent } from "src/app/shared/components/card/card.component";
import { CardHeaderComponent } from "src/app/shared/components/card-header/card-header.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from "src/app/shared/components/datepicker/datepicker.component";
import { TextBoxComponent } from "src/app/shared/components/textbox/textbox.component";
import { TextAreaComponent } from "src/app/shared/components/textarea/textarea.component";

@Component({
  selector: 'app-it-system-archive-details-frontpage',
  imports: [CardComponent, CardHeaderComponent, DatePickerComponent, TextBoxComponent, TextAreaComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './it-system-archive-details-frontpage.component.html',
  styleUrl: './it-system-archive-details-frontpage.component.scss',
})
export class ItSystemArchiveDetailsFrontpageComponent implements OnInit{

  public readonly archiveForm = new FormGroup({
        takenIntoUsageDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
        archivingDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
        referenceName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
        note: new FormControl<string | undefined>({ value: undefined, disabled: true }),
        //archiveReferences: new FormArray([this.createReferenceFormGroup()]),
  });
}
