import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, map, pairwise, startWith } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APISystemRelationWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { ModifyRelationDialogComponent } from '../modify-relation-dialog/modify-relation-dialog.component';
import { SystemRelationModel } from '../relation-table/relation-table.component';
import { ItSystemUsageDetailsRelationsDialogComponentStore } from './relation-dialog.component-store';

@Component({
  selector: 'app-base-relation-dialog[title]',
  templateUrl: './base-relation-dialog.component.html',
  styleUrls: ['./base-relation-dialog.component.scss'],
  providers: [ItSystemUsageDetailsRelationsDialogComponentStore],
})
export class BaseRelationDialogComponent extends BaseComponent implements OnInit {
  @Input() public title!: string;
  @Input() public relationModel?: SystemRelationModel;
  @Output() public saveEvent = new EventEmitter<APISystemRelationWriteRequestDTO>();

  public readonly relationForm = new FormGroup({
    systemUsage: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: false }),
    description: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    reference: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    contract: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    interface: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    frequency: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
  });

  public readonly systemUsages$ = this.componentStore.systemUsages$;
  public readonly systemUsagesLoading$ = this.componentStore.isSystemUsagesLoading$;
  public readonly contracts$ = this.componentStore.contracts$;
  public readonly contractsLoading$ = this.componentStore.contractsLoading$;
  public readonly interfaces$ = this.componentStore.interfaces$;
  public readonly interfacesLoading$ = this.componentStore.interfacesLoading$.pipe(
    concatLatestFrom(() => this.componentStore.systemUuidLoading$),
    map(([interfaceLoading, systemUuidLoading]) => interfaceLoading || systemUuidLoading)
  );

  public readonly showUsageSearchHelpText$ = this.componentStore.systemUsages$.pipe(
    filterNullish(),
    map((usages) => usages.length >= this.componentStore.PAGE_SIZE)
  );
  public readonly availableReferenceFrequencyTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-relation-frequency-type'))
    .pipe(filterNullish());

  //current system Uuid (system, not system usage)
  private readonly selectedSystemUuid$ = this.componentStore.systemUuid$;

  //selected usage uuids
  private readonly systemUsageUuid$ = new Subject<string | undefined>();
  //interface search terms
  private readonly searchInterfaceTerm$ = new Subject<string | undefined>();
  private readonly lastTwoSystemUsageUuids$ = this.systemUsageUuid$.pipe(
    startWith(undefined),
    pairwise(),
    map(([previous, current]) => ({ previous: previous, current: current }))
  );

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItSystemUsageDetailsRelationsDialogComponentStore,
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
          this.componentStore.getItInterfaces({ systemUuid: systemUuid, search: searchTerm });
        })
    );

    //when usage is selected enable the form, otherwise turn it off (other than the usage dropdown)
    this.subscriptions.add(
      this.lastTwoSystemUsageUuids$.subscribe(({ previous, current }) => {
        if (previous != current) {
          if (current) {
            this.relationForm.enable();
          } else {
            this.relationForm.disable();
            this.relationForm.controls.systemUsage.enable();
          }
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
          )
        )
        .subscribe(() => this.dialog.close())
    );

    //if it's the modify dialog, update the form values
    if (this.relationModel) {
      this.relationForm.setValue({
        systemUsage: this.relationModel.systemUsage,
        description: this.relationModel.description,
        reference: this.relationModel.urlReference,
        contract: this.relationModel.associatedContract,
        interface: this.relationModel.relationInterface,
        frequency: this.relationModel.relationFrequency,
      });
      //update the current usage uuid
      this.updateSelectedSystemUsage(this.relationModel.systemUsage.uuid);
    }
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

  public usageChange(usageUuid?: string) {
    this.updateSelectedSystemUsage(usageUuid);
  }

  public onSave() {
    if (!this.relationForm.valid) return;

    const usage = this.relationForm.value.systemUsage;
    if (!usage) return;

    const request = {
      toSystemUsageUuid: usage.uuid,
      relationInterfaceUuid: this.relationForm.value.interface?.uuid,
      associatedContractUuid: this.relationForm.value.contract?.uuid,
      relationFrequencyUuid: this.relationForm.value.frequency?.uuid,
      description: this.relationForm.value.description ?? undefined,
      urlReference: this.relationForm.value.reference ?? undefined,
    };

    this.saveEvent.emit(request);
  }

  public onClose() {
    this.dialog.close();
  }

  private updateSelectedSystemUsage(usageUuid?: string) {
    this.systemUsageUuid$.next(usageUuid);
    this.componentStore.updateCurrentSystemUuid(usageUuid);
  }
}
