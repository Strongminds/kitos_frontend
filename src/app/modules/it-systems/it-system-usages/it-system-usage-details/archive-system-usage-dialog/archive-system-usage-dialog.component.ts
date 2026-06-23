import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, map, startWith } from 'rxjs';
import { APICreateItSystemUsageArchiveRequestDTO } from 'src/app/api/v2';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { IconButtonComponent } from 'src/app/shared/components/buttons/icon-button/icon-button.component';
import { CollectionExtensionButtonComponent } from 'src/app/shared/components/collection-extension-button/collection-extension-button.component';
import { DatePickerComponent } from 'src/app/shared/components/datepicker/datepicker.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from 'src/app/shared/components/dialogs/dialog/dialog.component';
import { TrashcanIconComponent } from 'src/app/shared/components/icons/trashcan-icon.component';
import { StandardVerticalContentGridComponent } from 'src/app/shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextAreaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { TextBoxComponent } from 'src/app/shared/components/textbox/textbox.component';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { EditUrlSectionComponent } from '../edit-url-section/edit-url-section.component';

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
    IconButtonComponent,
    TrashcanIconComponent,
    CollectionExtensionButtonComponent,
    EditUrlSectionComponent,
  ],
  templateUrl: './archive-system-usage-dialog.component.html',
  styleUrl: './archive-system-usage-dialog.component.scss',
})
export class ArchiveSystemUsageDialogComponent {
  @Input() public itSystemUsageUuid!: string;

  public archiveFormGroup = new FormGroup({
    archivingDate: new FormControl<Date | undefined>(undefined),
    referenceName: new FormControl<string | undefined>(undefined),
    note: new FormControl<string | undefined>(undefined),
    archiveReferences: new FormArray([this.createReferenceFormGroup()]),
  });

  constructor(
    private readonly store: Store,
    public dialogRef: MatDialogRef<ArchiveSystemUsageDialogComponent>,
  ) {}

  public get archiveReferences() {
    return this.archiveFormGroup.controls.archiveReferences;
  }

  public addReference() {
    this.archiveReferences.push(this.createReferenceFormGroup());
  }

  public removeReference(index: number) {
    if (this.archiveReferences.length <= 1) return;
    this.archiveReferences.removeAt(index);
  }

  public onReferenceUpdated(index: number, simpleLink: SimpleLink | null) {
    const reference = this.archiveReferences.at(index);
    reference.patchValue({
      name: simpleLink?.name || undefined,
      url: simpleLink?.url || undefined,
    });
  }

  public getReference$(index: number): Observable<SimpleLink | undefined> {
    const reference = this.archiveReferences.at(index);
    return reference.valueChanges.pipe(
      startWith(reference.value),
      map(({ name, url }) => {
        const referenceName = name?.trim() || '';
        const referenceUrl = url?.trim() || '';
        if (!referenceName && !referenceUrl) return undefined;

        return {
          name: referenceName,
          url: referenceUrl,
        };
      }),
    );
  }

  public canRemoveReference(): boolean {
    return this.archiveReferences.length > 1;
  }

  onConfirm(): void {
    if (!this.archiveFormGroup.valid) return;
    const controls = this.archiveFormGroup.controls;
    if (!this.archiveFormGroup.controls.archivingDate.value) return;

    const archiveReferences = this.archiveReferences.controls
      .map((referenceControl) => {
        const name = referenceControl.controls.name.value?.trim() || '';
        const url = referenceControl.controls.url.value?.trim() || '';
        return { name, url };
      })
      .filter((reference) => reference.name !== '' || reference.url !== '');

    const hasInvalidReference = archiveReferences.some((reference) => !reference.name || !reference.url);
    if (hasInvalidReference) return;

    const dto: APICreateItSystemUsageArchiveRequestDTO = {
      archivingDate: controls.archivingDate?.value?.toISOString() || '',
      referenceName: controls.referenceName.value || '',
      note: controls.note.value || '',
      archiveReferences,
    };

    this.store.dispatch(ITSystemUsageActions.archiveItSystemUsage(this.itSystemUsageUuid, dto));
    this.dialogRef.close();
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  private createReferenceFormGroup() {
    return new FormGroup({
      name: new FormControl<string | undefined>(undefined),
      url: new FormControl<string | undefined>(undefined),
    });
  }
}
