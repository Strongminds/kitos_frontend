import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import {
  CONTRACT_SUPPLIERS_COLUMNS_ID,
  CONTRACT_SUPPLIERS_SECTION_NAME,
} from 'src/app/shared/constants/persistent-state-constants';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { itContractSupplierTypeOptions } from 'src/app/shared/models/it-contract/it-contract-supplier-type';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridActions } from 'src/app/store/grid/actions';
import { ITContractSupplierActions } from 'src/app/store/it-contract/it-contract-supplier/actions';
import {
  selectSupplierGridColumns,
  selectSupplierGridData,
  selectSupplierGridState,
  selectSupplierIsLoading,
} from 'src/app/store/it-contract/it-contract-supplier/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { ExportMenuButtonComponent } from '../../../shared/components/buttons/export-menu-button/export-menu-button.component';
import { GridOptionsButtonComponent } from '../../../shared/components/grid-options-button/grid-options-button.component';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { HideShowButtonComponent } from '../../../shared/components/grid/hide-show-button/hide-show-button.component';
import { OverviewHeaderComponent } from '../../../shared/components/overview-header/overview-header.component';

@Component({
  templateUrl: './it-contract-supplier.component.html',
  styleUrl: './it-contract-supplier.component.scss',
  selector: 'app-it-contract-supplier',
  standalone: true,
  imports: [
    CommonModule,
    OverviewHeaderComponent,
    GridOptionsButtonComponent,
    ExportMenuButtonComponent,
    HideShowButtonComponent,
    GridComponent,
    AsyncPipe,
  ],
})
export class ItContractSupplierComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectSupplierIsLoading);
  public readonly gridData$ = this.store.select(selectSupplierGridData);
  /*
  public readonly gridData$ = of({
    total: 1,
    data: [
      {
        id: 1,
        OrganizationId: 42,
        OrganizationUuid: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
        OrganizationName: 'Copenhagen Municipality',
        SupplierId: 123,
        SupplierType: { name: $localize`Intern`, id: 0 },
        SupplierUuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        SupplierName: 'TechCorp A/S',
        SupplierCvr: '12345678',
        IsSupplierDisabled: false,
        HighestCriticalityUuid: 'faef6c18-3a11-4412-af60-8db3fd1fdb15',
        HighestCriticalityName: 'Kritikalitet 1',
        HighestCriticalityRank: 1,
        ContractsAtHighestCriticalityCsv: 'Contract A, Contract B',
        ContractsAtHighestCriticality: [
          { id: 'bbed4548-b391-4343-a9a1-1b152c18252e', value: 'DefaultTestItContract' },
          { id: '550e8400-e29b-41d4-a716-222222222222', value: 'Contract B' },
        ],
      },
    ],
  });

  */
  public readonly gridState$ = this.store.select(selectSupplierGridState);
  public readonly gridColumns$ = this.store.select(selectSupplierGridColumns);

  private readonly supplierSectionName = CONTRACT_SUPPLIERS_SECTION_NAME;

  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'SupplierType',
      title: $localize`Intern/Ekstern`,
      section: this.supplierSectionName,
      hidden: false,
      extraFilter: 'enum',
      style: 'enum',
      extraData: itContractSupplierTypeOptions,
      persistId: 'supplierType',
    },
    {
      field: 'SupplierName',
      title: $localize`Leverandørnavn`,
      style: 'primary',
      section: this.supplierSectionName,
      hidden: false,
      persistId: 'supplierName',
    },
    {
      field: 'SupplierCvr',
      title: $localize`CVR`,
      section: this.supplierSectionName,
      hidden: false,
      persistId: 'supplierCvr',
    },
    {
      field: 'HighestCriticalityUuid',
      dataField: 'HighestCriticalityName',
      title: $localize`Beregnet kritikalitet`,
      style: 'uuid-to-name',
      section: this.supplierSectionName,
      extraFilter: 'choice-type',
      hidden: false,
      persistId: 'criticality',
      extraData: 'it-contract_criticality-type',
    },
    {
      field: 'ContractsAtHighestCriticality',
      title: $localize`Kontrakter med kritikalitet`,
      style: 'page-link-array',
      dataField: 'ContractsAtHighestCriticality',
      entityType: 'it-contract',
      section: this.supplierSectionName,
      hidden: false,
      width: 320,
      persistId: 'contractsAtHighestCriticality',
    },
  ];

  constructor(
    store: Store,
    private gridColumnStorageService: GridColumnStorageService,
    private actions$: Actions,
  ) {
    super(store, 'it-contract-supplier');
  }

  ngOnInit(): void {
    const existingColumns = this.gridColumnStorageService.getColumns(
      CONTRACT_SUPPLIERS_COLUMNS_ID,
      this.defaultGridColumns,
    );
    if (existingColumns) {
      this.store.dispatch(ITContractSupplierActions.updateGridColumns(existingColumns));
    } else {
      const columns = this.mapColumnOrder(this.defaultGridColumns);
      this.store.dispatch(ITContractSupplierActions.updateGridColumns(columns));
    }

    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_criticality-type'));

    this.subscriptions.add(
      this.gridState$.pipe(first()).subscribe((state) => {
        this.stateChange(state);
      }),
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractSupplierActions.resetGridConfiguration))
        .subscribe(() => this.useDefaultColumns()),
    );
  }

  private useDefaultColumns(): void {
    this.store.dispatch(ITContractSupplierActions.updateGridColumns(this.defaultGridColumns));
  }

  public stateChange(newState: GridState): void {
    this.store.dispatch(ITContractSupplierActions.updateGridState(newState));
  }

  public override onExcelExport = (exportAllColumns: boolean) => {
    this.gridState$.pipe(first()).subscribe((gridState) => {
      this.store.dispatch(
        GridActions.exportDataFetch(exportAllColumns, { ...gridState, all: true }, 'it-contract-supplier'),
      );
    });
  };
}
