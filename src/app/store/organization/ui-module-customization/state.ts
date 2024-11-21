import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';

export interface UIModuleConfigState {
  uiModuleConfigs: UIModuleConfig[];
  uiModuleConfigCachetimes: UIModuleConfigCacheTime[];
}

export interface UIModuleConfigCacheTime {
  module: UIModuleConfigKey;
  cacheTime: number | undefined;
}
