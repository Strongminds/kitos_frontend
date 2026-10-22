import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { initializeApplyFilterSubscription } from '../../../helpers/grid-filter.helpers';
import { getMonthDayCount, isDayMonthFilterValue } from '../../../helpers/day-month.helpers';
import { GridColumn } from '../../../models/grid-column.model';
import { RegistrationEntityTypes } from '../../../models/registrations/registration-entity-categories.model';
import { DropdownComponent } from '../../dropdowns/dropdown/dropdown.component';
import { DialogActionsComponent } from '../../dialogs/dialog-actions/dialog-actions.component';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button.component';
import { XIconComponent } from '../../icons/x-icon.component';
import { ButtonComponent } from '../../buttons/button/button.component';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

interface DatePartOption {
  name: string;
  value: number;
}

interface RangeOption {
  text: string;
  operator: 'gte' | 'lte';
}

@Component({
  selector: 'app-day-month-filter',
  templateUrl: './day-month-filter.component.html',
  styleUrls: ['./day-month-filter.component.scss'],
  imports: [IconButtonComponent, XIconComponent, DropdownComponent, ButtonComponent, DialogActionsComponent, CdkConnectedOverlay, CdkOverlayOrigin, CdkTrapFocus],
})
export class DayMonthFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public columnConfig?: GridColumn;

  @ViewChild('filterButton') private filterButton?: ButtonComponent;
  public isOpen = false;

  public readonly months = this.createNumberOptions(12);
  public days = this.createNumberOptions(31);
  public day?: DatePartOption | null;
  public month?: DatePartOption | null;
  public readonly options: RangeOption[] = [
    { text: $localize`Fra og med`, operator: 'gte' },
    { text: $localize`Til og med`, operator: 'lte' },
  ];
  public chosenOption = this.options[0];

  constructor(filterService: FilterService, private actions$: Actions) {
    super(filterService);
  }

  ngOnInit(): void {
    this.restoreFilter(this.getColumnFilter());
    if (this.entityType) {
      this.subscriptions.add(initializeApplyFilterSubscription(
        this.actions$, this.entityType, this.column.field, (filter) => this.restoreFilter(filter),
      ));
    }
  }

  public get buttonLabel(): string {
    return this.day && this.month
      ? `${this.chosenOption.operator === 'gte' ? '≥' : '≤'} ${this.day.name}-${this.month.name}`
      : $localize`Dato`;
  }

  public togglePanel(): void {
    this.isOpen = !this.isOpen;
  }

  public closePanel(): void {
    this.isOpen = false;
    this.filterButton?.focus();
  }

  public onPanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this.closePanel();
  }

  public dayChange(day: DatePartOption | null | undefined): void {
    this.day = day;
    this.applyDateFilter();
  }

  public monthChange(month: DatePartOption | null | undefined): void {
    this.month = month;
    this.updateDayOptions();
    this.applyDateFilter();
  }

  public optionChange(option: RangeOption | null | undefined): void {
    if (!option) return;
    this.chosenOption = option;
    this.applyDateFilter();
  }

  public resetFilter(): void {
    const hasAppliedFilter = !!this.getColumnFilter();
    this.restoreFilter(undefined);
    if (hasAppliedFilter) this.applyFilter(this.removeFilter(this.column.field));
    this.filterButton?.focus();
  }

  public get canReset(): boolean {
    return !!(this.day || this.month || this.getColumnFilter());
  }

  private applyDateFilter(): void {
    // Incomplete selections are drafts; only a complete date triggers a request.
    if (!this.day || !this.month) return;
    this.applyFilter(
      this.updateFilter({
        field: this.column.field,
        operator: this.chosenOption.operator,
        value: { month: this.month.value, day: this.day.value },
      }),
    );
  }

  private restoreFilter(filter: FilterDescriptor | null | undefined): void {
    const value = isDayMonthFilterValue(filter?.value) ? filter.value : undefined;
    this.month = this.months.find((option) => option.value === value?.month);
    this.day = value ? { name: String(value.day).padStart(2, '0'), value: value.day } : undefined;
    this.updateDayOptions();
    const operator = filter?.operator ?? this.columnConfig?.defaultDateFilterOperator;
    this.chosenOption = this.options.find((option) => option.operator === operator) ?? this.options[0];
  }

  private updateDayOptions(): void {
    this.days = this.createNumberOptions(getMonthDayCount(this.month?.value));
    if (this.day && !this.days.some((option) => option.value === this.day?.value)) this.day = undefined;
  }

  private createNumberOptions(count: number): DatePartOption[] {
    return Array.from({ length: count }, (_, index) => ({
      name: String(index + 1).padStart(2, '0'), value: index + 1,
    }));
  }
}
