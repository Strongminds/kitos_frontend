import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, first, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConnectedMultiSelectDropdownComponent } from 'src/app/shared/components/dropdowns/connected-multi-select-dropdown/connected-multi-select-dropdown.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';
import { DialogActionsComponent } from '../../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from '../../../../../../shared/components/dialogs/dialog/dialog.component';
import { ConnectedDropdownComponent } from '../../../../../../shared/components/dropdowns/connected-dropdown/connected-dropdown.component';
import { DropdownComponent } from '../../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextAreaComponent } from '../../../../../../shared/components/textarea/textarea.component';
import { TextBoxComponent } from '../../../../../../shared/components/textbox/textbox.component';
import { ModifyRelationDialogComponent } from '../modify-relation-dialog/modify-relation-dialog.component';
import { ItSystemUsageDetailsRelationsDialogComponentStore } from './relation-dialog.component-store';

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
    ConnectedMultiSelectDropdownComponent,
  ],
})
export class SystemRelationDialogComponent extends BaseComponent {
  @Input() public title!: string;
  @Input() public saveText!: string;

  public readonly systemUsages$ = this.componentStore.systemUsages$;
  public readonly systemUsagesLoading$ = this.componentStore.isSystemUsagesLoading$;
  public readonly contracts$ = this.componentStore.contracts$;
  public readonly contractsLoading$ = this.componentStore.contractsLoading$;
  public readonly interfaces$ = this.componentStore.interfacesAsMultiSelectDropdownItems$;

  public readonly interfacesLoading$ = this.componentStore.isInterfacesOrSystemUuidLoading$;

  public readonly usageSearchResultIsLimited$ = this.componentStore.usageSearchResultIsLimited$;

  public readonly availableReferenceFrequencyTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-relation-frequency-type'))
    .pipe(filterNullish());

  //current system Uuid (system, not system usage)
  protected readonly selectedSystemUuid$ = this.componentStore.systemUuid$;

  //selected usage uuids
  protected readonly changedSystemUsageUuid$ = this.componentStore.changedSystemUsageUuid$;
  //interface search terms
  protected readonly searchInterfaceTerm$ = new Subject<string | undefined>();

  public isBusy = false;

  constructor(
    protected readonly store: Store,
    protected readonly componentStore: ItSystemUsageDetailsRelationsDialogComponentStore,
    protected readonly dialog: MatDialogRef<ModifyRelationDialogComponent>,
    protected readonly actions$: Actions
  ) {
    super();
  }

  protected setupChangeSubscriptions() {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-relation-frequency-type'));

    //on selected system usage change or interface search change, load the interfaces
    this.subscriptions.add(
      combineLatest([this.selectedSystemUuid$, this.searchInterfaceTerm$])
        .pipe(map(([systemUuid, searchTerm]) => ({ systemUuid, searchTerm })))
        .subscribe(({ systemUuid, searchTerm }) => {
          this.componentStore.getItInterfaces({ systemUuid: systemUuid, search: searchTerm });
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

  public close() {
    this.dialog.close();
  }
}
