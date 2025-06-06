import { ActionReducer } from '@ngrx/store';
import { alertsFeature, initialAlertsState } from '../alerts/reducers';
import { itSystemUsageFeature, itSystemUsageInitialState } from '../it-system-usage/reducer';
import { itSystemFeature, itSystemInitialState } from '../it-system/reducer';
import { kleFeature, kleInitialState } from '../kle/reducer';
import { organizationUnitFeature, organizationUnitInitialState } from '../organization/organization-unit/reducer';
import { organizationFeature, organizationInitialState } from '../organization/reducer';
import { regularOptionTypeFeature, regularOptionTypeInitialState } from '../regular-option-type-store/reducer';
import { roleOptionTypeFeature, roleOptionTypeInitialState } from '../roles-option-type-store/reducer';
import { initialNotificationsState, notificationFeature } from '../user-notifications/reducer';
import { userFeature, userInitialState } from '../user-store/reducer';
import { resetOrganizationStateAction, resetStateAction } from './actions';
import { uiModuleConfigFeature, UIModuleConfigInitialState } from '../organization/ui-module-customization/reducer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resetReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    const initialStateDependingOnOrganization = {
      [itSystemFeature.name]: itSystemInitialState,
      [itSystemUsageFeature.name]: itSystemUsageInitialState,
      [regularOptionTypeFeature.name]: regularOptionTypeInitialState,
      [organizationUnitFeature.name]: organizationUnitInitialState,
      [roleOptionTypeFeature.name]: roleOptionTypeInitialState,
      [notificationFeature.name]: initialNotificationsState,
      [alertsFeature.name]: initialAlertsState,
      [organizationFeature.name]: organizationInitialState,
      [uiModuleConfigFeature.name]: UIModuleConfigInitialState,
    };

    switch (action.type) {
      case resetStateAction.type:
        return reducer(
          {
            ...state,
            ...initialStateDependingOnOrganization,
            [kleFeature.name]: kleInitialState,
            [userFeature.name]: userInitialState,
          },
          action,
        );
      case resetOrganizationStateAction.type:
        return reducer(
          {
            ...state,
            ...initialStateDependingOnOrganization,
          },
          action,
        );
    }

    return reducer(state, action);
  };
}
