import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APICreateItSystemUsageArchiveRequestDTO } from 'src/app/api/v2';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { DatePickerComponent } from 'src/app/shared/components/datepicker/datepicker.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from 'src/app/shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from 'src/app/shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextAreaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { TextBoxComponent } from 'src/app/shared/components/textbox/textbox.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-archive-system-usage-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    StandardVerticalContentGridComponent,
    DialogComponent,
    DialogActionsComponent,
    TextBoxComponent,
    DatePickerComponent,
    TextAreaComponent,
    ButtonComponent,
  ],
  templateUrl: './archive-system-usage-dialog.component.html',
  styleUrl: './archive-system-usage-dialog.component.scss',
})
export class ArchiveSystemUsageDialogComponent {
  @Input() public itSystemUsageUuid!: string;

  public archiveFormGroup = new FormGroup({
    //usageDate: new FormControl<Date | undefined>(undefined, Validators.required),
    archivingDate: new FormControl<Date | undefined>(undefined),
    referenceName: new FormControl<string | undefined>(undefined),
    note: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<ArchiveSystemUsageDialogComponent>,
  ) {}

  onConfirm(): void {
    if (!this.archiveFormGroup.valid) return;
    const controls = this.archiveFormGroup.controls;
    if (!this.archiveFormGroup.controls.archivingDate.value) return;

    const dto: APICreateItSystemUsageArchiveRequestDTO = {
      //usageDate: controls.usageDate.value?.toDateString() || '', TODO update backend model with this field from design document
      archivingDate: controls.archivingDate?.value?.toISOString() || '',
      referenceName: controls.referenceName.value || '',
      note: controls.note.value || '',
    };

    this.store.dispatch(ITSystemUsageActions.archiveItSystemUsage({ itSystemUsageUuid: this.itSystemUsageUuid, dto }));
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
