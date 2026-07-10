import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import {
  CONTRACT_SUPPLIER_COLUMNS_ID,
  CONTRACT_SUPPLIER_SECTION_NAME,
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
  public readonly gridData$ = this.store.select(selectSupplierGridData);
  public readonly gridState$ = this.store.select(selectSupplierGridState);
  public readonly gridColumns$ = this.store.select(selectSupplierGridColumns);

  private readonly supplierSectionName = CONTRACT_SUPPLIER_SECTION_NAME;

  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'IsExternal',
      title: $localize`Intern/Ekstern`,
      style: 'chip',
      section: this.supplierSectionName,
      hidden: false,
      filter: 'boolean',
    },
    {
      field: 'Name',
      title: $localize`Leverandørnavn`,
      style: 'primary',
      section: this.supplierSectionName,
      hidden: false,
    },
    {
      field: 'CVR',
      title: $localize`CVR`,
      section: this.supplierSectionName,
      hidden: false,
    },
    {
      field: 'CalculatedCriticality',
      title: $localize`Beregnet kritikalitet`,
      style: 'enum',
      section: this.supplierSectionName,
      hidden: false,
      extraFilter: 'enum',
    },
    {
      field: 'ContractsWithCriticality',
      title: $localize`Kontrakter med kritikalitet`,
      style: 'page-link-array',
      idField: 'Uuid',
      dataField: 'ContractNumber',
      section: this.supplierSectionName,
      hidden: false,
      sortable: false,
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
    const columnId = CONTRACT_SUPPLIER_COLUMNS_ID;
    const localStorageColumns =
      this.gridColumnStorageService.getColumns(columnId, this.defaultGridColumns) || this.defaultGridColumns;
    this.store.dispatch(ITContractSupplierActions.updateGridColumns(localStorageColumns));

    this.subscriptions.add(
      this.gridState$.pipe(first()).subscribe((state) => {
        this.store.dispatch(ITContractSupplierActions.getSuppliers(state));
      }),
    );

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(ITContractSupplierActions.deleteSupplierSuccess),
          concatLatestFrom(() => this.gridState$),
        )
        .subscribe(([_, gridState]) => {
          this.store.dispatch(ITContractSupplierActions.getSuppliers(gridState));
        }),
    );

    this.store.dispatch(ITContractSupplierActions.getSupplierCollectionPermissions());
  }

  public stateChange(newState: GridState): void {
    this.store.dispatch(ITContractSupplierActions.updateGridState(newState));
  }

  public onGridColumnsUpdated(gridColumns: GridColumn[]): void {
    this.store.dispatch(ITContractSupplierActions.updateGridColumnsSuccess(gridColumns));
  }

  public override onExcelExport = (exportAllColumns: boolean) => {
    this.gridState$.pipe(first()).subscribe((gridState) => {
      this.store.dispatch(
        GridActions.exportDataFetch(exportAllColumns, { ...gridState, all: true }, 'it-contract-supplier'),
      );
    });
  };
}
