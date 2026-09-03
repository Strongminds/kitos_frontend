import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import {
  APIFieldControlStateChoice,
  APISupplierAssociatedFieldConfigurationRequestDTO,
  APISupplierAssociatedFieldConfigurationResponseDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from 'src/app/shared/components/dialogs/dialog/dialog.component';
import {
  RadioButtonOption,
  RadioButtonsComponent,
} from 'src/app/shared/components/radio-buttons/radio-buttons.component';
import { getLabelFromFieldKey } from 'src/app/shared/models/field-permissions-map.model';
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
  protected readonly groupedFields$ = this.fields$.pipe(
    map((fields) =>
      fields.flatMap((field) => {
        const fieldKey = field.fieldKey;
        const groupTitle = fieldKey?.includes('DataProcessingRegistration')
          ? 'Data processing registration'
          : fieldKey?.includes('ItSystemUsage')
            ? 'IT system usage'
            : null;
        return [
          { type: 'title' as const, title: groupTitle },
          { type: 'field' as const, field },
        ];
      }),
    ),
    map((items) =>
      items.filter((item, index, array) => {
        if (item.type !== 'title' || !item.title) {
          return item.type !== 'title';
        }
        const previousTitle = index > 0 ? array[index - 1] : null;
        return previousTitle?.type !== 'title' || previousTitle.title !== item.title;
      }),
    ),
  );
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

  protected readonly suppliersLabel = 'Leverandør';
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
    const formValue = this.selectedByFieldForm.getRawValue() as Record<string, APIFieldControlStateChoice>;
    const requestDto: APISupplierAssociatedFieldConfigurationRequestDTO = {
      configurations: Object.entries(formValue).map(([fieldKey, controlState]) => ({
        fieldKey,
        controlState,
      })),
    };
    this.componentStore.submit(requestDto);
    this.dialogRef.close(requestDto);
  }

  protected fieldTrackBy(_: number, field: APISupplierAssociatedFieldConfigurationResponseDTO): string {
    return field.fieldKey ?? '';
  }

  protected getFieldControl(fieldKey: string): FormControl<APIFieldControlStateChoice> {
    return this.selectedByFieldForm.get(fieldKey) as FormControl<APIFieldControlStateChoice>;
  }

  protected getLabelFromFieldKey(fieldKey: string | null): string {
    return getLabelFromFieldKey(fieldKey);
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
