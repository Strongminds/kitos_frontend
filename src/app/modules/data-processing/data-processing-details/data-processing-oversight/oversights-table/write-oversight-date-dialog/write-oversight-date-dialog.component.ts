import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, first, of } from 'rxjs';
import { APIOversightDateDTO } from 'src/app/api/v2';
import { EditUrlSectionComponent } from 'src/app/modules/it-systems/it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/edit-url-section/edit-url-section.component';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { selectDataProcessingOversightDates } from 'src/app/store/data-processing/selectors';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';
import { DatePickerComponent } from '../../../../../../shared/components/datepicker/datepicker.component';
import { DialogActionsComponent } from '../../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from '../../../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextAreaComponent } from '../../../../../../shared/components/textarea/textarea.component';

@Component({
  selector: 'app-write-oversight-date-dialog',
  templateUrl: './write-oversight-date-dialog.component.html',
  styleUrl: './write-oversight-date-dialog.component.scss',
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    DatePickerComponent,
    TextAreaComponent,
    DialogActionsComponent,
    ButtonComponent,
    EditUrlSectionComponent,
  ],
})
export class WriteOversightDateDialogComponent extends BaseComponent implements OnInit {
  @Input() public oversightDate: APIOversightDateDTO | undefined;

  public test$ = of({
    url: 'https://www.kitos.dk',
    name: 'someTitle',
  });

  public oversightDateFormGroup = new FormGroup({
    date: new FormControl<Date | undefined>(undefined, Validators.required),
    notes: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    reportLinkUrl: new FormControl<string | undefined>(undefined),
    reportLinkName: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<WriteOversightDateDialogComponent>,
    private actions$: Actions
  ) {
    super();
  }

  public isBusy = false;
  public isEdit = false;
  public title = 'Tilføj tilsyn';

  ngOnInit(): void {
    if (this.oversightDate?.uuid) {
      this.isEdit = true;
      this.title = 'Rediger tilsyn';

      this.oversightDateFormGroup.patchValue({
        date: optionalNewDate(this.oversightDate.completedAt),
        notes: this.oversightDate.remark,
        reportLinkUrl: this.oversightDate.oversightReportLink?.url,
        reportLinkName: this.oversightDate.oversightReportLink?.name,
      });
      this.oversightDateFormGroup.controls.notes.enable();
    }

    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.patchDataProcessingSuccess)).subscribe(() => {
        this.onCancel();
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.patchDataProcessingError)).subscribe(() => {
        this.isBusy = false;
      })
    );

    this.subscriptions.add(
      this.oversightDateFormGroup.statusChanges.pipe(distinctUntilChanged()).subscribe((status) => {
        if (status === 'VALID') {
          this.oversightDateFormGroup.controls.notes.enable();
        } else {
          this.oversightDateFormGroup.controls.notes.disable();
        }
      })
    );
  }

  public onSave() {
    if (this.oversightDateFormGroup.invalid) {
      return;
    }

    this.isBusy = true;

    const request: APIOversightDateDTO = {
      completedAt: this.oversightDateFormGroup.value.date!.toISOString(),
      remark: this.oversightDateFormGroup.value.notes ?? '',
    };

    this.store
      .select(selectDataProcessingOversightDates)
      .pipe(first())
      .subscribe((oversightDates) => {
        if (this.isEdit) {
          this.store.dispatch(
            DataProcessingActions.patchDataProcessingOversightDate(
              { ...request, uuid: this.oversightDate?.uuid },
              oversightDates
            )
          );
        } else {
          this.store.dispatch(DataProcessingActions.addDataProcessingOversightDate(request, oversightDates));
        }
      });
  }

  public onCancel() {
    this.dialogRef.close();
  }
}
