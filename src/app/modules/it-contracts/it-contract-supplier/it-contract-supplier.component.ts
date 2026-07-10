import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, of } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import {
  CONTRACT_SUPPLIERS_COLUMNS_ID,
  CONTRACT_SUPPLIERS_SECTION_NAME,
} from 'src/app/shared/constants/persistent-state-constants';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridActions } from 'src/app/store/grid/actions';
import { ITContractSupplierActions } from 'src/app/store/it-contract/it-contract-supplier/actions';
import {
  selectSupplierGridColumns,
  selectSupplierGridData,
  selectSupplierGridState,
  selectSupplierIsLoading,
} from 'src/app/store/it-contract/it-contract-supplier/selectors';
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
  //public readonly gridData$ = this.store.select(selectSupplierGridData);
public readonly gridData$ = of({
  total: 1,
  data: [{
   id: 1,
   organizationId: 42,
   organizationUuid: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
   organizationName: 'Copenhagen Municipality',
   supplierId: 123,
   isInternalContract: false,
   supplierUuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
   supplierName: 'TechCorp A/S',
   supplierCvr: '12345678',
   isSupplierDisabled: false,
   highestCriticalityUuid: 'c9036a3e-ae3e-42b9-8cb3-12c905f15f20',
   highestCriticalityName: 'Critical',
   highestCriticalityRank: 1,
   contractsAtHighestCriticalityCsv: 'Contract A, Contract B',
   contractsAtHighestCriticality: [
     { uuid: '550e8400-e29b-41d4-a716-111111111111', name: 'SLA Contract 2024' },
     { uuid: '550e8400-e29b-41d4-a716-222222222222', name: 'Maintenance Agreement' }
   ],
 } ]
})
  public readonly gridState$ = this.store.select(selectSupplierGridState);
  public readonly gridColumns$ = this.store.select(selectSupplierGridColumns);

  private readonly supplierSectionName = CONTRACT_SUPPLIERS_SECTION_NAME;

  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'isInternalContract',
      title: $localize`Intern/Ekstern`,
      style: 'chip',
      section: this.supplierSectionName,
      hidden: false,
      filter: 'boolean',
      extraData: [
        { name: $localize`Intern`, value: true },
        { name: $localize`Ekstern`, value: false },
      ],
      persistId: 'isInternal',
    },
    {
      field: 'supplierName',
      title: $localize`Leverandørnavn`,
      style: 'primary',
      section: this.supplierSectionName,
      hidden: false,
      persistId: 'supplierName',
    },
    {
      field: 'supplierCvr',
      title: $localize`CVR`,
      section: this.supplierSectionName,
      hidden: false,
      persistId: 'supplierCvr',
    },
    {
      field: 'highestCriticalityName',
      title: $localize`Beregnet kritikalitet`,
      style: 'enum',
      section: this.supplierSectionName,
      hidden: false,
      persistId: 'criticality',
    },
    {
      field: 'contractsAtHighestCriticality',
      title: $localize`Kontrakter med kritikalitet`,
      style: 'page-link-array',
      idField: 'uuid',
      dataField: 'name',
      section: this.supplierSectionName,
      hidden: false,
      sortable: false,
      persistId: 'contracts',
    },
  ];

  constructor(
    store: Store,
    private gridColumnStorageService: GridColumnStorageService,
  ) {
    super(store, 'it-contract-supplier');
  }

  ngOnInit(): void {
    const existingColumns = this.gridColumnStorageService.getColumns(
      CONTRACT_SUPPLIERS_COLUMNS_ID,
      this.defaultGridColumns,
    );
    console.log('existingColumns', existingColumns);
    if (existingColumns) {
      console.log('dispatching existingColumns', existingColumns);
      this.store.dispatch(ITContractSupplierActions.updateGridColumns(existingColumns));
    } else {
      const columns = this.mapColumnOrder(this.defaultGridColumns);
      console.log('dispatching defaultGridColumns', columns);
      this.store.dispatch(ITContractSupplierActions.updateGridColumns(columns));
    }

    this.gridColumns$.pipe(first()).subscribe((columns) => {
      console.log('gridColumns observable has value', columns);
    })

    this.subscriptions.add(
      this.gridState$.pipe(first()).subscribe((state) => {
        this.store.dispatch(ITContractSupplierActions.getSuppliers(state));
      }),
    );
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
