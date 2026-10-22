import { DayMonthFilterValue, isDayMonthFilterValue } from './day-month.helpers';
import { CompositeFilterDescriptor, FilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import {
  InvoiceDate1,
  InvoiceDate2,
  InvoiceDate3,
  InvoiceDate4,
} from '../constants/it-contracts-grid-column-constants';
import { GridState } from '../models/grid-state.model';

const invoiceDateFields = [InvoiceDate1, InvoiceDate2, InvoiceDate3, InvoiceDate4];

export function formatInvoiceDate(month: number | null | undefined, day: number | null | undefined): string {
  if (month == null || day == null) return '';
  return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}`;
}

// Preserve compact display-field descriptors in UI state and saved views. Expand
// them only for the server query, including the query fetching all rows for export.
export function prepareInvoiceDateQueryState(state: GridState): GridState {
  return {
    ...state,
    sort: state.sort?.flatMap((sort) =>
      invoiceDateFields.includes(sort.field)
        ? [{ ...sort, field: `${sort.field}Month` }, { ...sort, field: `${sort.field}Day` }]
        : [sort],
    ),
    filter: state.filter ? mapInvoiceDateFilters(state.filter) : undefined,
  };
}

function mapInvoiceDateFilters(filter: CompositeFilterDescriptor): CompositeFilterDescriptor {
  return { ...filter, filters: filter.filters.flatMap(mapInvoiceDateFilter) };
}

function mapInvoiceDateFilter(entry: CompositeFilterDescriptor | FilterDescriptor): (CompositeFilterDescriptor | FilterDescriptor)[] {
  if (isCompositeFilterDescriptor(entry)) {
    const mapped = mapInvoiceDateFilters(entry);
    return mapped.filters.length ? [mapped] : [];
  }
  if (typeof entry.field !== 'string' || !invoiceDateFields.includes(entry.field)) return [entry];
  if (!isDayMonthFilterValue(entry.value) || (entry.operator !== 'gte' && entry.operator !== 'lte')) return [];
  return [createInvoiceDateRangeFilter(entry.field, entry.value, entry.operator)];
}

function createInvoiceDateRangeFilter(
  field: string,
  value: DayMonthFilterValue,
  operator: 'gte' | 'lte',
): CompositeFilterDescriptor {
  const monthField = `${field}Month`;
  const dayField = `${field}Day`;
  return {
    logic: 'and',
    filters: [
      { field: monthField, operator: 'isnotnull' },
      { field: dayField, operator: 'isnotnull' },
      {
        logic: 'or',
        filters: [
          { field: monthField, operator: operator === 'gte' ? 'gt' : 'lt', value: value.month },
          {
            logic: 'and',
            filters: [
              { field: monthField, operator: 'eq', value: value.month },
              { field: dayField, operator, value: value.day },
            ],
          },
        ],
      },
    ],
  };
}
