import { RelatedEntityType } from "src/app/store/alerts/state";
import { UIModuleConfigKey } from "../enums/ui-module-config-key";

export function ModuleKeyFromRelatedEntity(entityType: RelatedEntityType): UIModuleConfigKey {
  switch (entityType) {
    case RelatedEntityType.ItSystemUsage:
      return UIModuleConfigKey.ItSystemUsage;
    case RelatedEntityType.ItContract:
      return UIModuleConfigKey.ItContract;
    case RelatedEntityType.DataProcessingRegistration:
      return UIModuleConfigKey.DataProcessingRegistrations;
  }
}
