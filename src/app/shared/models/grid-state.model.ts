import { State, toODataString as kendoToOdataString } from '@progress/kendo-data-query';
import { ODataSettings } from '@progress/kendo-data-query/dist/npm/odata.operators';

export interface GridState extends State {
  all?: boolean;
}

export const DEFAULT_GRID_TAKE = 70;

export const defaultGridState: GridState = {
  skip: 0,
  take: DEFAULT_GRID_TAKE,
}

export const toODataString = (gridState: GridState, settings?: ODataSettings) => {
  // Remove take/top from created odata string if page size of 'all' is chosen
  return kendoToOdataString({ ...gridState, skip: gridState.all === true ? 0 : gridState.skip, take: gridState.all === true ? undefined : gridState.take }, settings);
}
