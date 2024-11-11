import { Injectable } from '@angular/core';
import { GridColumn } from '../models/grid-column.model';
import { StatePersistingService } from './state-persisting.service';

@Injectable({
  providedIn: 'root',
})
export class GridColumnStorageService {
  constructor(private localStorage: StatePersistingService) {}

  public setColumns(key: string, columns: GridColumn[]): void {
    const hash = this.computeHash(this.filterOutRoleColumns(columns));
    this.localStorage.set<GridColumnCache>(key + '-test', { columns, hash });
  }

  public getColumns(key: string, defaultColumns: GridColumn[]): GridColumn[] | null {
    const existingCache = this.localStorage.get<GridColumnCache>(key + '-test');
    const cachedColumns = existingCache?.columns;
    if (!cachedColumns) return null;
    const newHash = this.computeHash(this.filterOutRoleColumns(defaultColumns));
    if (existingCache.hash !== newHash) return null;
    return cachedColumns;
  }

  private filterOutRoleColumns(columns: GridColumn[]): GridColumn[] {
    return columns.filter((column) => !column.field.includes('Roles.Role'));
  }

  private computeHash(columns: GridColumn[]): string {
    const hashableColumns = columns.map(this.toHashableGridColumn).sort((a, b) => a.field.localeCompare(b.field));
    return this.hashMappedColumns(hashableColumns);
  }

  private hashMappedColumns(columns: GridColumn[]): string {
    const json = JSON.stringify(columns);
    // Simple hash functio
    let hash = 0;
    for (let i = 0; i < json.length; i++) {
      const char = json.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // marks the fields that are not relevant for hashing to a constant, as to not effect the hash
  private toHashableGridColumn(column: GridColumn): GridColumn {
    return {...column, width: undefined, hidden: false, disabledByUIConfig: undefined};
  }
}

type GridColumnCache = {
  columns: GridColumn[];
  hash: string;
};
