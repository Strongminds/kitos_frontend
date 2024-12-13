import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { first, Observable } from 'rxjs';
import { initializeApplyFilterSubscription } from 'src/app/shared/helpers/grid-filter.helpers';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ColumnFilterDataService, GridDataKey } from 'src/app/shared/services/column-filter-data.service';
import { GridSavedFilterActions } from 'src/app/store/grid/actions';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { DropdownFilterComponent, FilterDropdownOption } from '../dropdown-filter/dropdown-filter.component';

@Component({
  selector: 'app-dropdown-column-data-filter',
  templateUrl: './dropdown-column-data-filter.component.html',
  styleUrl: './dropdown-column-data-filter.component.scss',
})
export class DropdownColumnDataFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @ViewChild(DropdownFilterComponent) dropdownFilter!: DropdownFilterComponent;
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() columnName!: string;
  @Input() serviceKey!: GridDataKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() entityType!: RegistrationEntityTypes;

  public options$!: Observable<FilterDropdownOption[]>;

  constructor(
    filterService: FilterService,
    private actions$: Actions,
    private columnFilterDataService: ColumnFilterDataService
  ) {
    super(filterService);
  }

  ngOnInit(): void {
    this.options$ = this.columnFilterDataService.get(this.serviceKey);

    const updateMethod: (filter: FilterDescriptor | undefined) => void = (filter) => {
      this.actions$
        .pipe(
          ofType(GridSavedFilterActions.dropdownDataOptionsUpdated),
          concatLatestFrom(() => this.options$),
          first()
        )
        .subscribe(([payload, options]) => {
          if (payload.column !== this.columnName || this.entityType !== payload.entityType) {
            return;
          }
          const newValue = filter?.value;
          const newOption = options.find((option) => option.value === newValue);
          this.dropdownFilter.chosenOption = newOption;
        });
    };
    initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, updateMethod);
  }

  private getProperty<T, K extends keyof T>(obj: T, propName: K): T[K] {
    return obj[propName];
  }
}
