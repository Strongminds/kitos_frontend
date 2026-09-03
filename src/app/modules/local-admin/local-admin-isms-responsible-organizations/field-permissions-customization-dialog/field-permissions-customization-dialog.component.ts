import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { APIFieldControlStateChoice, APISupplierAssociatedFieldConfigurationResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from 'src/app/shared/components/dialogs/dialog/dialog.component';
import {
  RadioButtonOption,
  RadioButtonsComponent,
} from 'src/app/shared/components/radio-buttons/radio-buttons.component';
import { FieldPermissionsCustomizationDialogComponentStore } from './field-permissions-customization-dialog.component-store';

@Component({
  selector: 'app-field-permisisons-customization-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogComponent,
    DialogActionsComponent,
    ButtonComponent,
    RadioButtonsComponent,
  ],
  templateUrl: './field-permissions-customization-dialog.component.html',
  styleUrl: './field-permissions-customization-dialog.component.scss',
  providers: [FieldPermissionsCustomizationDialogComponentStore],
})
export class FieldPermissionsCustomizationDialogComponent extends BaseComponent implements OnInit {
  protected readonly fields$ = this.componentStore.fields$;
  protected readonly selectedByFieldForm = new FormGroup({});

  constructor(
    private readonly dialogRef: MatDialogRef<FieldPermissionsCustomizationDialogComponent>,
    private readonly componentStore: FieldPermissionsCustomizationDialogComponentStore,
    private readonly cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.componentStore.getFields();
    this.subscriptions.add(
      this.componentStore.fields$.subscribe((fields) => {
        this.rebuildForm(fields);
        this.cdr.markForCheck();
      }),
    );
  }

  protected readonly suppliersLabel = 'Ansvarlige';
  protected readonly municipalityLabel = 'Kommune';
  protected readonly sharedLabel = 'Delte';
  protected readonly controlStateOptions: RadioButtonOption<APIFieldControlStateChoice>[] = [
    { id: APIFieldControlStateChoice.Supplier, label: '' },
    { id: APIFieldControlStateChoice.Organization, label: '' },
    { id: APIFieldControlStateChoice.Shared, label: '' },
  ];
  protected readonly title = $localize`Field authorization customization`;

  protected onCancel(): void {
    this.dialogRef.close();
  }

  protected onSave(): void {
    const formValue = this.selectedByFieldForm.getRawValue();
    this.componentStore.submit(formValue);
    this.dialogRef.close(formValue);
  }

  protected fieldTrackBy(_: number, field: APISupplierAssociatedFieldConfigurationResponseDTO): string {
    return field.fieldKey ?? '';
  }

  protected getFieldControl(fieldKey: string): FormControl<APIFieldControlStateChoice> {
    return this.selectedByFieldForm.get(fieldKey) as FormControl<APIFieldControlStateChoice>;
  }

  private rebuildForm(fields: APISupplierAssociatedFieldConfigurationResponseDTO[]): void {
    Object.keys(this.selectedByFieldForm.controls).forEach((controlName) => {
      this.selectedByFieldForm.removeControl(controlName);
    });

    fields.forEach((field) => {
      if (!field.fieldKey) {
        return;
      }

      this.selectedByFieldForm.addControl(
        field.fieldKey,
        new FormControl(field.controlState ?? APIFieldControlStateChoice.Supplier, { nonNullable: true }),
      );
    });
  }
}
