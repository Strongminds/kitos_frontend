import { createSelector } from '@ngrx/store';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';
import { uiModuleConfigFeature } from './reducer';
import { UIModuleConfigState } from './state';

export const { selectUIModuleCustomizationState } = uiModuleConfigFeature;

export const selectUIModuleConfig = createSelector(selectUIModuleCustomizationState, (state: UIModuleConfigState) => {
  return state.uiModuleConfigs;
});

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createTabEnabledSelector = (tabFullKey: string) =>
  createSelector(selectITSystemUsageUIModuleConfig, (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;

    return tabIsEnabled(moduleConfigViewModels, tabFullKey);
  });

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
const createFieldOrGroupEnabledSelector = (tabFullKey: string, fieldKey: string) =>
  createSelector(selectITSystemUsageUIModuleConfig, (itSystemUsageModuleConfig) => {
    const moduleConfigViewModels = itSystemUsageModuleConfig?.moduleConfigViewModel;
    if (!moduleConfigViewModels) return true;

    return fieldOrGroupIsEnabled(moduleConfigViewModels, tabFullKey, fieldKey);
  });

export const selectITSystemUsageUIModuleConfig = createSelector(
  selectUIModuleCustomizationState,
  (state: UIModuleConfigState) => {
    return state.uiModuleConfigs.find((c) => c.module == UIModuleConfigKey.ItSystemUsage);
  }
);

//IT system usage
//Tab selectors
export const selectITSystemUsageUIModuleConfigEnabledTabGdpr = createTabEnabledSelector('ItSystemUsages.gdpr');
export const selectITSystemUsageUIModuleConfigEnabledTabSystemRoles =
  createTabEnabledSelector('ItSystemUsages.systemRoles');
export const selectITSystemUsageUIModuleConfigEnabledTabOrganization =
  createTabEnabledSelector('ItSystemUsages.organization');
export const selectITSystemUsageUIModuleConfigEnabledTabSystemRelations = createTabEnabledSelector(
  'ItSystemUsages.systemRelations'
);
export const selectITSystemUsageUIModuleConfigEnabledTabInterfaces =
  createTabEnabledSelector('ItSystemUsages.interfaces');
export const selectITSystemUsageUIModuleConfigEnabledTabArchiving =
  createTabEnabledSelector('ItSystemUsages.archiving');
export const selectITSystemUsageUIModuleConfigEnabledTabHierarchy =
  createTabEnabledSelector('ItSystemUsages.hierarchy');
export const selectITSystemUsageUIModuleConfigEnabledTabLocalKle = createTabEnabledSelector('ItSystemUsages.localKle');
export const selectITSystemUsageUIModuleConfigEnabledTabNotifications =
  createTabEnabledSelector('ItSystemUsages.advice');
export const selectITSystemUsageUIModuleConfigEnabledTabLocalReferences = createTabEnabledSelector(
  'ItSystemUsages.localReferences'
);

//Field selectors
export const selectITSystemUsageUIModuleConfigEnabledFieldFrontPageUsagePeriod = createFieldOrGroupEnabledSelector(
  'ItSystemUsages.frontPage',
  'usagePeriod'
);
export const selectITSystemUsageUIModuleConfigEnabledFieldFrontPageLifeCycleStatus = createFieldOrGroupEnabledSelector(
  'ItSystemUsages.frontPage',
  'lifeCycleStatus'
);
export const selectITSystemUsageUIModuleConfigEnabledFieldContractsSelectContractToDetermineIfItSystemIsActive =
  createFieldOrGroupEnabledSelector('ItSystemUsages.contracts', 'selectContractToDetermineIfItSystemIsActive');
export const selectITSystemUsageUIModuleConfigEnabledFieldGdprPlannedRiskAssessmentDate =
  createFieldOrGroupEnabledSelector('ItSystemUsages.gdpr', 'plannedRiskAssessmentDate');

function tabIsEnabled(uiConfigViewModels: UIConfigNodeViewModel, tabFullKey: string): boolean {
  const tabViewModel = getTabViewModelFromModule(uiConfigViewModels, tabFullKey);
  return tabViewModel?.isEnabled ?? true;
}

function fieldOrGroupIsEnabled(
  uiConfigViewModels: UIConfigNodeViewModel,
  tabFullKey: string,
  fieldKey: string
): boolean {
  const tabViewModel = getTabViewModelFromModule(uiConfigViewModels, tabFullKey);
  const tabViewModelChildren = tabViewModel?.children;
  if (!tabViewModelChildren) return true;

  const fieldFullKey = [tabFullKey, fieldKey].join('.');
  const fieldViewModel = tabViewModelChildren.find((vm) => vm.fullKey === fieldFullKey);
  return fieldViewModel?.isEnabled ?? true;
}

function getTabViewModelFromModule(
  uiConfigViewModels: UIConfigNodeViewModel,
  tabFullKey: string
): UIConfigNodeViewModel | undefined {
  const moduleConfigChildren = uiConfigViewModels.children;
  if (!moduleConfigChildren) return undefined;
  return moduleConfigChildren.find((vm) => vm.fullKey === tabFullKey);
}