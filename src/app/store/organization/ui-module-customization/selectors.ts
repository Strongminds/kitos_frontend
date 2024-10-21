import { createSelector } from '@ngrx/store';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { tabIsEnabled } from 'src/app/shared/models/helpers/ui-config-helpers';
import { uiModuleConfigFeature } from './reducer';
import { UIModuleConfigState } from './state';

export const { selectUIModuleCustomizationState } = uiModuleConfigFeature;

export const selectUIModuleConfig = createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
  return state.uiModuleConfigs;
});

export const selectITSystemUsageUIModuleConfig = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleConfigState) => {
    return state.uiModuleConfigs.find((c) => c.module == UIModuleConfigKey.ItSystemUsage);
  }
);

export const selectITSystemUsageUIModuleConfigEnableTabGdpr = createSelector(
  selectITSystemUsageUIModuleConfig,
  (itSystemUsageModuleConfig) => {
    const moduleConfig = itSystemUsageModuleConfig?.configViewModels;
    if (!moduleConfig) return true;

    return tabIsEnabled(moduleConfig, 'ItSystemUsages.gdpr');
  }
);
