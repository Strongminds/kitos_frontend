import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIIdentityNamePairResponseDTO, APISystemRelationWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { SystemRelationModel } from '../relation-table/relation-table.component';
import { ItSystemUsageDetailsRelationsDialogComponentStore } from '../system-relation-dialog/relation-dialog.component-store';
import {
  SystemRelationDialogComponent,
} from '../system-relation-dialog/system-relation-dialog.component';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { combineLatest, first, map, Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';

export interface SystemRelationModifyDialogFormModel {
  systemUsage: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  description: FormControl<string | null | undefined>;
  reference: FormControl<string | null | undefined>;
  contract: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  interface: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  frequency: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
}

@Component({
  selector: 'app-modify-relation-dialog[relationModel]',
  templateUrl: './modify-relation-dialog.component.html',
  styleUrls: ['./modify-relation-dialog.component.scss'],
  providers: [ItSystemUsageDetailsRelationsDialogComponentStore],
  imports: [SystemRelationDialogComponent],
})
export class ModifyRelationDialogComponent extends BaseComponent implements OnInit {
  @Input() public relationModel!: SystemRelationModel;

  public relationForm!: FormGroup<SystemRelationDialogFormModel>;

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
        this.relationForm.controls.interface.reset();
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
            ITSystemUsageActions.addItSystemUsageRelationSuccess,
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
            ITSystemUsageActions.addItSystemUsageRelationError,
            ITSystemUsageActions.patchItSystemUsageRelationError
          )
        )
        .subscribe(() => {
          this.isBusy = false;
        })
    );

    this.relationForm = new FormGroup<SystemRelationModifyDialogFormModel>({
      systemUsage: new FormControl<APIIdentityNamePairResponseDTO | undefined>(
        {
          value: this.relationModel.systemUsage,
          disabled: false,
        },
        Validators.required,
      ),
      description: new FormControl<string | undefined>({ value: this.relationModel.description, disabled: false }),
      reference: new FormControl<string | undefined>({ value: this.relationModel.urlReference, disabled: false }),
      contract: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
        value: this.relationModel.associatedContract,
        disabled: false,
      }),
      interface: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
        value: this.relationModel.relationInterface,
        disabled: false,
      }),
      frequency: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
        value: this.relationModel.relationFrequency,
        disabled: false,
      }),
    });

    //update the current usage uuid
    this.componentStore.updateCurrentSystemUuid(this.relationModel.systemUsage.uuid);
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

  public interfaceValueChange(newInterface: IdentityNamePair) {
    console.log('Selected interface: ', JSON.stringify(newInterface));
    this.relationForm.controls.interface.setValue(newInterface);
    // this.relationForm.controls.interface.setValue(
    //   interfaceUuid
    //     ? {
    //         uuid: interfaceUuid,
    //         name: '',
    //       }
    //     : null
    // );
  }

  public usageChange(usageUuid?: string) {
    this.componentStore.updateCurrentSystemUuid(usageUuid);
  }

  public save() {
    if (!this.relationForm.valid) return;

    const usage = this.relationForm.value.systemUsage;
    if (!usage) return;

    this.isBusy = true;

    const request = {
      toSystemUsageUuid: usage.uuid,
      relationInterfaceUuid: this.relationForm.value.interface?.uuid,
      associatedContractUuid: this.relationForm.value.contract?.uuid,
      relationFrequencyUuid: this.relationForm.value.frequency?.uuid,
      description: this.relationForm.value.description ?? undefined,
      urlReference: this.relationForm.value.reference ?? undefined,
    };

    this.store.dispatch(ITSystemUsageActions.patchItSystemUsageRelation(this.relationModel.uuid, request));
  }

  public close() {
    this.dialog.close();
  }
}
