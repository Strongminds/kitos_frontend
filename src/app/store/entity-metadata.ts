import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  ITSystem: {},
};

const pluralNames = {};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames,
};
