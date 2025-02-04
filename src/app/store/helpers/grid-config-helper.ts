import { APIColumnConfigurationResponseDTO } from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';

export function getNewGridColumnsBasedOnConfig(
  columnConfigs: APIColumnConfigurationResponseDTO[],
  columns: GridColumn[]
): GridColumn[] {
  const columnsWithHiddenState = columns.map((col) => ({
    ...col,
    hidden: !columnConfigs.some((config) => columnIsConfigTarget(col, config)),
  }));
  return columnsWithHiddenState.sort((a, b) => {
    const aIndex = getColumnIndexFromConfig(columnConfigs, a);
    const bIndex = getColumnIndexFromConfig(columnConfigs, b);
    return aIndex - bIndex;
  });
}

function getColumnIndexFromConfig(columnConfigs: APIColumnConfigurationResponseDTO[], column: GridColumn) {
  return columnConfigs.findIndex((config) => columnIsConfigTarget(column, config))
}

function columnIsConfigTarget(column: GridColumn, columnConfig: APIColumnConfigurationResponseDTO){
  return column.persistId === columnConfig.persistId;
}
