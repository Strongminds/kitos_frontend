import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';
import { UIModuleCustomization } from 'src/app/shared/models/ui-config/ui-module-customization.model';
import { UIModuleConfigActions } from './actions';
import { UIModuleConfigCacheTime, UIModuleConfigState } from './state';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';

export const uiModuleConfigAdapter = createEntityAdapter<UIModuleCustomization>();

export const UIModuleConfigInitialState: UIModuleConfigState = uiModuleConfigAdapter.getInitialState({
  uiModuleConfigs: [],
  uiModuleConfigCachetimes: [],
});

export const uiModuleConfigFeature = createFeature({
  name: 'UIModuleCustomization',
  reducer: createReducer(
    UIModuleConfigInitialState,
    on(
      UIModuleConfigActions.getUIModuleConfigSuccess,
      (state, { uiModuleConfig }): UIModuleConfigState => ({
        ...state,
        uiModuleConfigs: updateUIModuleConfigs(state, uiModuleConfig),
        uiModuleConfigCachetimes: updateUIModuleConfigCacheTime(state, uiModuleConfig.module),
      })
    ),
    on(
      UIModuleConfigActions.putUIModuleCustomizationSuccess,
      (state, { uiModuleConfig }): UIModuleConfigState => ({
        ...state,
        uiModuleConfigs: updateUIModuleConfigs(state, uiModuleConfig),
        uiModuleConfigCachetimes: bustUIModuleConfigCache(state, uiModuleConfig.module),
      })
    )
  ),
});

function updateUIModuleConfigs(state: UIModuleConfigState, newUIModuleConfig: UIModuleConfig): UIModuleConfig[] {
  const existingUIModuleConfigs = state.uiModuleConfigs;
  const existingConfigIndex = existingUIModuleConfigs.findIndex((c) => c.module === newUIModuleConfig.module);
  const updatedUIModuleConfigs = [...existingUIModuleConfigs];

  if (existingConfigIndex === -1) {
    updatedUIModuleConfigs.push(newUIModuleConfig);
  } else {
    const existingConfig = updatedUIModuleConfigs[existingConfigIndex];
    updatedUIModuleConfigs[existingConfigIndex] = {
      ...existingConfig,
      moduleConfigViewModel: newUIModuleConfig.moduleConfigViewModel,
    };
  }

  return updatedUIModuleConfigs;
}

function updateUIModuleConfigCacheTime(state: UIModuleConfigState, module: UIModuleConfigKey): UIModuleConfigCacheTime[] {
  const existingCacheTimes = state.uiModuleConfigCachetimes;
  const existingCacheTimeIndex = existingCacheTimes.findIndex((c) => c.module === module);
  const updatedCacheTimes = [...existingCacheTimes];
  const cacheTime = Date.now();

  if (existingCacheTimeIndex === -1) {
    updatedCacheTimes.push({ module, cacheTime });
  } else {
    const existingCache = updatedCacheTimes[existingCacheTimeIndex];
    updatedCacheTimes[existingCacheTimeIndex] = { ... existingCache, cacheTime };
  }

  return updatedCacheTimes;
}

function bustUIModuleConfigCache(state: UIModuleConfigState, module: UIModuleConfigKey): UIModuleConfigCacheTime[] {
  const existingCacheTimes = state.uiModuleConfigCachetimes;
  const existingCacheTimeIndex = existingCacheTimes.findIndex((c) => c.module === module);
  const updatedCacheTimes = [...existingCacheTimes];

  if (existingCacheTimeIndex === -1) {
    updatedCacheTimes.push({ module, cacheTime: undefined });
  } else {
    const existingCache = updatedCacheTimes[existingCacheTimeIndex];
    updatedCacheTimes[existingCacheTimeIndex] = { ... existingCache, cacheTime: undefined };
  }

  return updatedCacheTimes;
}
