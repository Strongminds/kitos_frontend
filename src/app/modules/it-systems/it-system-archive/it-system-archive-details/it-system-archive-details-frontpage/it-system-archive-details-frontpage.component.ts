import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { CardHeaderComponent } from 'src/app/shared/components/card-header/card-header.component';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { DatePickerComponent } from 'src/app/shared/components/datepicker/datepicker.component';
import { TextAreaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { TextBoxComponent } from 'src/app/shared/components/textbox/textbox.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemArchive } from 'src/app/store/it-system-archive/selectors';

@Component({
  selector: 'app-it-system-archive-details-frontpage',
  imports: [
    CardComponent,
    CardHeaderComponent,
    DatePickerComponent,
    TextBoxComponent,
    TextAreaComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './it-system-archive-details-frontpage.component.html',
  styleUrl: './it-system-archive-details-frontpage.component.scss',
})
export class ItSystemArchiveDetailsFrontpageComponent extends BaseComponent implements OnInit {
  public readonly itSystemArchive$ = this.store.select(selectItSystemArchive).pipe(filterNullish());

  public readonly archiveForm = new FormGroup({
    takenIntoUsageDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    archivingDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    referenceName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    note: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    //archiveReferences: new FormArray([this.createReferenceFormGroup()]),
  });

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.itSystemArchive$.subscribe((systemArchive) => {
        this.archiveForm.patchValue({
          takenIntoUsageDate: systemArchive.takenIntoUsageDate ? new Date(systemArchive.takenIntoUsageDate) : undefined,
          archivingDate: systemArchive.archivingDate ? new Date(systemArchive.archivingDate) : undefined,
          referenceName: systemArchive.referenceName,
          note: systemArchive.note,
        });
      }),
    );
  }
}
