import { createAction } from '@ngrx/store';
import { GridState } from 'src/app/shared/models/grid-state.model';

export const GridExportActions = {
  exportDataFetch: createAction('[Grid Export] Fetch Data', (exportAllColumns: boolean, gridState: GridState) => ({ exportAllColumns, gridState })),
  exportCompleted: createAction('[Grid Export] Completed', (gridState: GridState) => ({ gridState })),
};
