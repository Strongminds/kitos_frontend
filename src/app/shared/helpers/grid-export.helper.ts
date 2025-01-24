import { GridColumn } from '../models/grid-column.model';

export function includedColumnInExport(column: GridColumn): boolean {
  return column.style !== 'action-buttons' && !column.disabledByUIConfig;
}

export function transformRow(item: any, exportColumns: GridColumn[]): any {
  const transformedItem = { ...item };
  exportColumns.forEach((column) => {
    const field = column.field;
    if (field) {
      switch (column.style) {
        case 'chip':
          if (typeof transformedItem[field] === 'boolean') {
            const boolValue = transformedItem[field] ? 0 : 1;
            transformedItem[field] = column.extraData[boolValue].name;
          }
          break;
        case 'enum':
          if (typeof transformedItem[field] === 'object') {
            const enumValue = transformedItem[field];
            transformedItem[field] = enumValue.name;
          }
          break;
        case 'uuid-to-name':
          transformedItem[field] = transformedItem[`${column.dataField}`];
          break;
        case 'excel-only': {
          if (transformedItem.RoleEmails) {
            const roleEmailKeys: string[] = Object.keys(transformedItem.RoleEmails);
            roleEmailKeys.forEach((key) => {
              const prefixedKey = `Roles.${key}`;
              if (prefixedKey === field) {
                transformedItem[`${column.title}`] = transformedItem.RoleEmails[key];
              }
            });
          }
          break;
        }
        case 'page-link-array':
          {
            const array = transformedItem[column.dataField as string];
            const excelValue = array.map((item: { value: string }) => item.value).join(', ');
            transformedItem[field] = excelValue;
          }
          break;
        case 'usages':
          {
            const usages = transformedItem[column.field as string];
            transformedItem[field] = usages.length;
          }
          break;
        default:
          break;
      }
    }
  });
  return transformedItem;
}

export function getValueToExport(gridColumn: GridColumn, item: any): string {
  return "";
}
