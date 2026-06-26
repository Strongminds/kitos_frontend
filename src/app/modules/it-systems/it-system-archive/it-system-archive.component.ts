import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ARCHIVE_COLUMNS_ID, ARCHIVE_SECTION_NAME } from 'src/app/shared/constants/persistent-state-constants';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridActions } from 'src/app/store/grid/actions';
import { ITSystemArchiveActions } from 'src/app/store/it-system-archive/actions';
import {
  selectArchiveGridColumns,
  selectArchiveGridData,
  selectArchiveGridState,
  selectArchiveHasDeletePermission,
  selectArchiveIsLoading,
} from 'src/app/store/it-system-archive/selectors';
import { ExportMenuButtonComponent } from '../../../shared/components/buttons/export-menu-button/export-menu-button.component';
import { GridOptionsButtonComponent } from '../../../shared/components/grid-options-button/grid-options-button.component';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { HideShowButtonComponent } from '../../../shared/components/grid/hide-show-button/hide-show-button.component';
import { OverviewHeaderComponent } from '../../../shared/components/overview-header/overview-header.component';

@Component({
  templateUrl: './it-system-archive.component.html',
  styleUrl: './it-system-archive.component.scss',
  selector: 'app-it-system-archive',
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
export class ItSystemArchiveComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectArchiveIsLoading);
  public readonly gridData$ = this.store.select(selectArchiveGridData);
  public readonly gridState$ = this.store.select(selectArchiveGridState);
  public readonly gridColumns$ = this.store.select(selectArchiveGridColumns);
  public readonly hasDeletePermission$ = this.store.select(selectArchiveHasDeletePermission);

  private readonly systemSectionName = ARCHIVE_SECTION_NAME;

  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'ArchivingDate',
      title: $localize`Arkiveringsdato`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 140,
      minResizableWidth: 140,
      hidden: false,
    },
    {
      field: 'ReferenceName',
      title: $localize`Referencenavn`,
      section: this.systemSectionName,
      width: 180,
      minResizableWidth: 180,
      hidden: false,
    },
    {
      field: 'SystemUuid',
      title: $localize`IT System UUID`,
      section: this.systemSectionName,
      width: 220,
      minResizableWidth: 220,
      hidden: false,
    },
    {
      field: 'SystemName',
      title: $localize`Systemnavn`,
      style: 'primary',
      section: this.systemSectionName,
      width: 220,
      minResizableWidth: 220,
      hidden: false,
    },
    {
      field: 'LocalName',
      title: $localize`Lokalt systemnavn`,
      section: this.systemSectionName,
      width: 220,
      minResizableWidth: 220,
      hidden: true,
    },
    {
      field: 'LocalId',
      title: $localize`Lokalt system ID`,
      section: this.systemSectionName,
      width: 160,
      minResizableWidth: 160,
      hidden: true,
    },
    {
      field: 'Note',
      title: $localize`Note`,
      section: this.systemSectionName,
      width: 240,
      minResizableWidth: 240,
      hidden: true,
    },
  ];

  constructor(
    private store: Store,
    private gridColumnStorageService: GridColumnStorageService,
    private actions$: Actions,
  ) {
    super();
  }

  ngOnInit(): void {
    // Initialize grid columns from localStorage
    const columnId = ARCHIVE_COLUMNS_ID;
    const localStorageColumns =
      this.gridColumnStorageService.getColumns(columnId, this.defaultGridColumns) || this.defaultGridColumns;
    this.store.dispatch(ITSystemArchiveActions.updateGridColumns(localStorageColumns));

    // Dispatch initial load
    this.subscriptions.add(
      this.gridState$.pipe(first()).subscribe((state) => {
        this.store.dispatch(ITSystemArchiveActions.getITSystemArchives(state));
      }),
    );

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(ITSystemArchiveActions.deleteITSystemArchiveSuccess),
          concatLatestFrom(() => this.gridState$),
        )
        .subscribe(([_, gridState]) => {
          this.store.dispatch(ITSystemArchiveActions.getITSystemArchives(gridState));
        }),
    );

    this.store.dispatch(ITSystemArchiveActions.getITSystemArchiveCollectionPermissions());
  }

  public stateChange(newState: GridState): void {
    this.store.dispatch(ITSystemArchiveActions.updateGridState(newState));
  }

  public onDeleteEvent(archive: any): void {
    if (archive?.Uuid) {
      this.store.dispatch(ITSystemArchiveActions.deleteITSystemArchive(archive.Uuid));
    }
  }

  public onExcelExport = (exportAllColumns: boolean) => {
    this.gridState$.pipe(first()).subscribe((gridState) => {
      this.store.dispatch(
        GridActions.exportDataFetch(exportAllColumns, { ...gridState, all: true }, 'it-system-archive'),
      );
    });
  };
}
