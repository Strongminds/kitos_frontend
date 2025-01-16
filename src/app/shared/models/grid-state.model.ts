import { State, toODataString as kendoToOdataString } from '@progress/kendo-data-query';
import { ODataSettings } from '@progress/kendo-data-query/dist/npm/odata.operators';

export interface GridState extends State {
  all?: boolean;
}

export const DEFAULT_VIRTUALIZTION_PAGE_SIZE = 70; // Default page size for

export const defaultODataGridState: GridState = {
  skip: 0,
  take: DEFAULT_VIRTUALIZTION_PAGE_SIZE,
};

export const defaultLocalGridState: GridState = {
  skip: 0,
  take: 100,
};

export const toODataString = (gridState: GridState, settings?: ODataSettings) => {
  // Remove take/top from created odata string if page size of 'all' is chosen
  return kendoToOdataString(
    {
      ...gridState,
      skip: gridState.all === true ? 0 : gridState.skip,
      take: gridState.all === true ? undefined : gridState.take,
    },
    settings
  );
};
