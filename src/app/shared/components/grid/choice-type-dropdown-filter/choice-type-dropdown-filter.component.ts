import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { map, Observable } from 'rxjs';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { DropdownOption } from '../dropdown-filter/dropdown-filter.component';

@Component({
  selector: 'app-choice-type-dropdown-filter',
  templateUrl: './choice-type-dropdown-filter.component.html',
  styleUrl: './choice-type-dropdown-filter.component.scss',
})
export class ChoiceTypeDropdownFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() choiceTypeName: RegularOptionType = 'it-system_business-type';
  @Input() sortOptions = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public options$: Observable<DropdownOption[]> | undefined;

  public chosenOption?: DropdownOption;

  constructor(filterService: FilterService, private store: Store) {
    super(filterService);
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions(this.choiceTypeName));
    this.options$ = this.store.select(selectRegularOptionTypes(this.choiceTypeName)).pipe(
      map((options) => options?.map((option) => ({ name: option.name, value: option.uuid })) ?? []) /* ,
      map((options) => this.applySorting(options)) */
    );

    this.chosenOption = this.getColumnFilter()?.value;
  }

  private applySorting(options: DropdownOption[]): DropdownOption[] {
    if (!this.sortOptions) {
      return options;
    }

    return options.sort((a, b) => {
      const fieldA = a.name.toLowerCase();
      const fieldB = b.name.toLowerCase();

      if (fieldA < fieldB) {
        return -1;
      }
      if (fieldA > fieldB) {
        return 1;
      }
      return 0;
    });
  }

  public didChange(option?: DropdownOption | null): void {
    this.applyFilter(
      option === undefined || option === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: option.value,
          })
    );
  }
}
