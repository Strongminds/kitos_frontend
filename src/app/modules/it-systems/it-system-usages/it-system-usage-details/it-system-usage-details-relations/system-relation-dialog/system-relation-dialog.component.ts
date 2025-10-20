import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, combineLatest, first, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIItInterfaceResponseDTO, APISystemRelationWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { ModifyRelationDialogComponent } from '../modify-relation-dialog/modify-relation-dialog.component';
import { ItSystemUsageDetailsRelationsDialogComponentStore } from './relation-dialog.component-store';
import { DialogComponent } from '../../../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { ConnectedDropdownComponent } from '../../../../../../shared/components/dropdowns/connected-dropdown/connected-dropdown.component';
import { TextAreaComponent } from '../../../../../../shared/components/textarea/textarea.component';
import { TextBoxComponent } from '../../../../../../shared/components/textbox/textbox.component';
import { DropdownComponent } from '../../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { DialogActionsComponent } from '../../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';
import { AsyncPipe } from '@angular/common';
import { ConnectedMultiSelectDropdownComponent } from 'src/app/shared/components/dropdowns/connected-multi-select-dropdown/connected-multi-select-dropdown.component';
import { MultiSelectDropdownItem } from 'src/app/shared/models/dropdown-option.model';

export interface SystemRelationDialogFormModel {
  systemUsage: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  description: FormControl<string | null | undefined>;
  reference: FormControl<string | null | undefined>;
  contract: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  interface: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
  frequency: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
}

@Component({
  selector: 'app-system-relation-dialog[title][saveText][relationForm]',
  templateUrl: './system-relation-dialog.component.html',
  styleUrls: ['./system-relation-dialog.component.scss'],
  imports: [
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
    ConnectedMultiSelectDropdownComponent
  ],
})
export class SystemRelationDialogComponent extends BaseComponent implements OnInit {
  @Input() public title!: string;
  @Input() public saveText!: string;
  @Input() public relationForm!: FormGroup<SystemRelationDialogFormModel>;
  @Output() public saveRequested = new EventEmitter<APISystemRelationWriteRequestDTO>();

  public readonly systemUsages$ = this.componentStore.systemUsages$;
  public readonly systemUsagesLoading$ = this.componentStore.isSystemUsagesLoading$;
  public readonly contracts$ = this.componentStore.contracts$;
  public readonly contractsLoading$ = this.componentStore.contractsLoading$;
 // public readonly interfaces$ = this.componentStore.interfaces$;
  public readonly interfaces$ = new BehaviorSubject<MultiSelectDropdownItem<APIItInterfaceResponseDTO>[]>([{
      name: 'Interface 1',
      value: {"lastModified":"2025-10-20T11:23:01.2191851Z","lastModifiedBy":{"uuid":"e96179ff-1a8d-41bb-99e6-3ed629f73c0a","name":"Automatisk oprettet testbruger (GlobalAdmin)"},"scope":"Local","itInterfaceType":undefined,"data":[],"organizationContext":{"cvr":undefined,"uuid":"f4d12639-e071-45d9-9fa0-8c0c438bb431","name":"Fælles Kommune"},"rightsHolder":{"name":'n',"uuid":'2123'},"uuid":"15dd470e-4b66-4eae-89b5-35cee5c80f1c","exposedBySystem":{"uuid":"80c03701-8b79-411c-bbbe-0992949ac7a3","name":"44"},"name":"444snitflade","interfaceId":"","version":undefined,"description":'desc',"notes":undefined,"urlReference":undefined,"deactivated":false,"created":"2025-10-20T11:22:51.3909301Z","createdBy":{"uuid":"e96179ff-1a8d-41bb-99e6-3ed629f73c0a","name":"Automatisk oprettet testbruger (GlobalAdmin)"}},
      disabled: false,
      selected: false
    },
  {
      name: 'Interface 2',
      value: {"lastModified":"2025-10-20T11:23:01.2191851Z","lastModifiedBy":{"uuid":"e96179ff-1a8d-41bb-99e6-3ed629f73c0a","name":"Automatisk oprettet testbruger (GlobalAdmin)"},"scope":"Local","itInterfaceType":undefined,"data":[],"organizationContext":{"cvr":undefined,"uuid":"f4d12639-e071-45d9-9fa0-8c0c438bb431","name":"Fælles Kommune"},"rightsHolder":{"name":'n',"uuid":'2123'},"uuid":"15dd470e-4b66-4eae-89b5-35cee5c80f1c","exposedBySystem":{"uuid":"80c03701-8b79-411c-bbbe-0992949ac7a3","name":"44"},"name":"444snitflade","interfaceId":"","version":undefined,"description":'desc',"notes":undefined,"urlReference":undefined,"deactivated":false,"created":"2025-10-20T11:22:51.3909301Z","createdBy":{"uuid":"e96179ff-1a8d-41bb-99e6-3ed629f73c0a","name":"Automatisk oprettet testbruger (GlobalAdmin)"}},
      disabled: false,
      selected: false
    }]);
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
    private readonly actions$: Actions,
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
        }),
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
      }),
    );

    //on success close the dialog
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRelationSuccess,
            ITSystemUsageActions.patchItSystemUsageRelationSuccess,
          ),
          first(),
        )
        .subscribe(() => this.dialog.close()),
    );

    //on error set isBusy to false
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRelationError,
            ITSystemUsageActions.patchItSystemUsageRelationError,
          ),
        )
        .subscribe(() => {
          this.isBusy = false;
        }),
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

    this.saveRequested.emit(request);
  }

  public close() {
    this.dialog.close();
  }
}
