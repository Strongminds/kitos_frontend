import { GridUIModuleCache, UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';

export interface UIModuleConfigState {
  uiModuleConfigs: UIModuleConfig[];
  gridUIModuleCache: GridUIModuleCache[];
  loading: boolean;
}
