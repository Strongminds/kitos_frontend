import { Injectable } from '@angular/core';

@Injectable()
export class EntitySelectionService<TEntity, TTypes> {
  private selectedItems: Map<TTypes, Set<TEntity>> = new Map();

  initSelectedItems(entityTypes: TTypes[]): void {
    entityTypes.forEach((type) => {
      this.selectedItems.set(type, new Set());
    });
  }

  selectItem(entityType: TTypes, entity: TEntity): void {
    this.selectedItems.get(entityType)?.add(entity);
  }

  deselectItem(entityType: TTypes, entity: TEntity): void {
    this.selectedItems.get(entityType)?.delete(entity);
  }

  isItemSelected(entityType: TTypes, entity: TEntity): boolean {
    return this.selectedItems.get(entityType)?.has(entity) ?? false;
  }

  selectAllOfType(entityType: TTypes, entity: TEntity[]): void {
    this.selectedItems.set(entityType, new Set(entity));
  }

  deselectAllOfType(entityType: TTypes): void {
    this.selectedItems.set(entityType, new Set());
  }

  deselectAll(): void {
    this.selectedItems.forEach((_, entityType) => this.deselectAllOfType(entityType));
  }

  isAllOfTypeSelected(entityType: TTypes, entities: TEntity[]): boolean {
    return entities.every((entity) => this.isItemSelected(entityType, entity));
  }

  getSelectedItemsOfType(entityType: TTypes): TEntity[] {
    return Array.from(this.selectedItems.get(entityType)?.values() ?? []);
  }

  getSelectedItems(): TEntity[] {
    const sets = Array.from(this.selectedItems.values());
    return sets.flatMap((set) => Array.from(set));
  }
}
