import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, first, map, Subject } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from 'src/app/shared/components/dialogs/dialog/dialog.component';
import { ConnectedDropdownComponent } from 'src/app/shared/components/dropdowns/connected-dropdown/connected-dropdown.component';
import { ConnectedMultiSelectDropdownComponent } from 'src/app/shared/components/dropdowns/connected-multi-select-dropdown/connected-multi-select-dropdown.component';
import { DropdownComponent } from 'src/app/shared/components/dropdowns/dropdown/dropdown.component';
import { StandardVerticalContentGridComponent } from 'src/app/shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextAreaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { TextBoxComponent } from 'src/app/shared/components/textbox/textbox.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { ModifyRelationDialogComponent } from '../modify-relation-dialog/modify-relation-dialog.component';
import { ItSystemUsageDetailsRelationsDialogComponentStore } from '../system-relation-dialog/relation-dialog.component-store';
import { SystemRelationDialogComponent } from '../system-relation-dialog/system-relation-dialog.component';

export interface SystemRelationCreateDialogFormModel {
  systemUsage: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  description: FormControl<string | null | undefined>;
  reference: FormControl<string | null | undefined>;
  contract: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  interfaces: FormControl<APIIdentityNamePairResponseDTO[] | null | undefined>;
  frequency: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
}

@Component({
  selector: 'app-create-relation-dialog',
  templateUrl: './create-relation-dialog.component.html',
  styleUrls: ['./create-relation-dialog.component.scss'],
  providers: [ItSystemUsageDetailsRelationsDialogComponentStore],
  imports: [
    SystemRelationDialogComponent,
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    ConnectedDropdownComponent,
    TextAreaComponent,
    TextBoxComponent,
    DropdownComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
    ConnectedMultiSelectDropdownComponent,
  ],
})
export class CreateRelationDialogComponent extends SystemRelationDialogComponent {
  public relationForm = new FormGroup<SystemRelationCreateDialogFormModel>({
    systemUsage: new FormControl<APIIdentityNamePairResponseDTO | undefined>(
      { value: undefined, disabled: false },
      Validators.required
    ),
    description: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    reference: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    contract: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    interfaces: new FormControl<APIIdentityNamePairResponseDTO[] | undefined>({ value: undefined, disabled: true }),
    frequency: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
  });

  public readonly interfacesAsMultiSelectDropdownItems$ = this.componentStore.interfacesAsMultiSelectDropdownItems$;

  public readonly interfacesDropdownResetSubject$ = new Subject<void>();

  public clearInterfaceInputFlag$ = new Subject<boolean>();

  constructor(
    protected override readonly store: Store,
    protected override readonly componentStore: ItSystemUsageDetailsRelationsDialogComponentStore,
    protected override readonly dialog: MatDialogRef<ModifyRelationDialogComponent>,
    protected override readonly actions$: Actions
  ) {
    super(store, componentStore, dialog, actions$);
  }

  ngOnInit(): void {
    this.setupChangeSubscriptions();
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-relation-frequency-type'));

    //when usage is selected enable the form, otherwise turn it off (other than the usage dropdown)
    this.subscriptions.add(
      this.changedSystemUsageUuid$.subscribe((usageUuid) => {
        this.interfacesDropdownResetSubject$.next();
        if (usageUuid) {
          this.relationForm.enable();
        } else {
          this.relationForm.disable();
          this.relationForm.controls['systemUsage'].enable();
        }
      })
    );

    //on success close the dialog
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRelationsSuccess,
            ITSystemUsageActions.patchItSystemUsageRelationSuccess
          ),
          first()
        )
        .subscribe(() => this.dialog.close())
    );
  }

  public interfaceValueChange(newInterfaces: APIIdentityNamePairResponseDTO[]) {
    this.relationForm.controls.interfaces.setValue(newInterfaces);
  }

  public save() {
    if (!this.relationForm.valid) return;

    const usage = this.relationForm.value.systemUsage;
    if (!usage) return;

    this.isBusy = true;

    const formValue = this.relationForm.value;
    const requests =
      formValue.interfaces === undefined || formValue.interfaces === null || formValue.interfaces.length === 0
        ? [
            {
              toSystemUsageUuid: usage.uuid,
              relationInterfaceUuid: undefined,
              associatedContractUuid: formValue.contract?.uuid,
              relationFrequencyUuid: formValue.frequency?.uuid,
              description: formValue.description ?? undefined,
              urlReference: formValue.reference ?? undefined,
            },
          ]
        : formValue.interfaces.map((x) => ({
            toSystemUsageUuid: usage.uuid,
            relationInterfaceUuid: x.uuid,
            associatedContractUuid: formValue.contract?.uuid,
            relationFrequencyUuid: formValue.frequency?.uuid,
            description: formValue.description ?? undefined,
            urlReference: formValue.reference ?? undefined,
          }));
    this.store.dispatch(ITSystemUsageActions.addItSystemUsageRelations(requests));
  }
}
