import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, first, map, Subject } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APISystemRelationWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from 'src/app/shared/components/dialogs/dialog/dialog.component';
import { ConnectedDropdownComponent } from 'src/app/shared/components/dropdowns/connected-dropdown/connected-dropdown.component';
import { ConnectedMultiSelectDropdownComponent } from 'src/app/shared/components/dropdowns/connected-multi-select-dropdown/connected-multi-select-dropdown.component';
import { DropdownComponent } from 'src/app/shared/components/dropdowns/dropdown/dropdown.component';
import { StandardVerticalContentGridComponent } from 'src/app/shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextAreaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { TextBoxComponent } from 'src/app/shared/components/textbox/textbox.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
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
export class CreateRelationDialogComponent extends BaseComponent {
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

  @Input() public title!: string;
  @Input() public saveText!: string;
  @Output() public saveRequested = new EventEmitter<APISystemRelationWriteRequestDTO>();

  public readonly systemUsages$ = this.componentStore.systemUsages$;
  public readonly systemUsagesLoading$ = this.componentStore.isSystemUsagesLoading$;
  public readonly contracts$ = this.componentStore.contracts$;
  public readonly contractsLoading$ = this.componentStore.contractsLoading$;
  public readonly interfaces$ = this.componentStore.interfaces$;

  public readonly interfacesLoading$ = this.componentStore.isInterfacesOrSystemUuidLoading$;

  public readonly usageSearchResultIsLimited$ = this.componentStore.usageSearchResultIsLimited$;

  public readonly availableReferenceFrequencyTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-relation-frequency-type'))
    .pipe(filterNullish());

  //current system Uuid (system, not system usage)
  private readonly selectedSystemUuid$ = this.componentStore.systemUuid$;

  //selected usage uuids
  private readonly changedSystemUsageUuid$ = this.componentStore.changedSystemUsageUuid$;
  //interface search terms
  private readonly searchInterfaceTerm$ = new Subject<string | undefined>();

  public isBusy = false;

  constructor(
    protected readonly store: Store,
    protected readonly componentStore: ItSystemUsageDetailsRelationsDialogComponentStore,
    private readonly dialog: MatDialogRef<ModifyRelationDialogComponent>,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-relation-frequency-type'));

    //on selected system usage change or interface search change, load the interfaces
    this.subscriptions.add(
      combineLatest([this.selectedSystemUuid$, this.searchInterfaceTerm$])
        .pipe(map(([systemUuid, searchTerm]) => ({ systemUuid, searchTerm })))
        .subscribe(({ systemUuid, searchTerm }) => {
          console.log(`Searching interfaces for system ${systemUuid} with term "${searchTerm}"`);
          this.componentStore.getItInterfaces({ systemUuid: systemUuid, search: searchTerm });
        })
    );

    //when usage is selected enable the form, otherwise turn it off (other than the usage dropdown)
    this.subscriptions.add(
      this.changedSystemUsageUuid$.subscribe((usageUuid) => {
        this.relationForm.controls.interfaces.reset();
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

    //on error set isBusy to false
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRelationsError,
            ITSystemUsageActions.patchItSystemUsageRelationError
          )
        )
        .subscribe(() => {
          this.isBusy = false;
        })
    );
  }

  public usageFilterChange(search?: string) {
    this.componentStore.getItSystemUsages(search);
  }

  public contractFilterChange(search?: string) {
    this.componentStore.getItContracts(search);
  }

  public interfaceFilterChange(search?: string) {
    this.searchInterfaceTerm$.next(search);
  }

  public interfaceValueChange(newInterfaces: APIIdentityNamePairResponseDTO[]) {
    console.log('Selected interface: ', JSON.stringify(newInterfaces));
    this.relationForm.controls.interfaces.setValue(newInterfaces);
  }

  public usageChange(usageUuid?: string) {
    this.componentStore.updateCurrentSystemUuid(usageUuid);
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
              associatedContractUuid: this.relationForm.value.contract?.uuid,
              relationFrequencyUuid: this.relationForm.value.frequency?.uuid,
              description: this.relationForm.value.description ?? undefined,
              urlReference: this.relationForm.value.reference ?? undefined,
            },
          ]
        : formValue.interfaces.map((x) => ({
            toSystemUsageUuid: usage.uuid,
            relationInterfaceUuid: x.uuid,
            associatedContractUuid: this.relationForm.value.contract?.uuid,
            relationFrequencyUuid: this.relationForm.value.frequency?.uuid,
            description: this.relationForm.value.description ?? undefined,
            urlReference: this.relationForm.value.reference ?? undefined,
          }));
    this.store.dispatch(ITSystemUsageActions.addItSystemUsageRelations(requests));
  }

  public close() {
    this.dialog.close();
  }
}
