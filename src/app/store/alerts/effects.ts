import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { APIV2AlertsINTERNALService } from 'src/app/api/v2';
import { AlertActions } from './actions';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { selectOrganizationUuid, selectUserUuid } from '../user-store/selectors';
import { catchError, filter, map, mergeMap, of } from 'rxjs';
import { mapRelatedEntityTypeToDTO } from 'src/app/shared/helpers/entity-type.helper';
import { adaptAlert } from './state';

@Injectable()
export class AlertsEffects {
  constructor(private actions$: Actions, private store: Store, private alertsService: APIV2AlertsINTERNALService) {}

  getAlerts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AlertActions.getAlerts),
      concatLatestFrom(() => [this.store.select(selectUserUuid), this.store.select(selectOrganizationUuid)]),
      filter(([_, userUuid, organizationUuid]) => userUuid !== undefined && organizationUuid !== undefined),
      mergeMap(([{ entityType }, userUuid, organizationUuid]) => {
        return this.alertsService
          .getManyAlertsV2GetByOrganizationAndUser({
            organizationUuid: organizationUuid!,
            userUuid: userUuid!,
            relatedEntityType: mapRelatedEntityTypeToDTO(entityType),
          })
          .pipe(
            map((alerts) => AlertActions.getAlertsSuccess(entityType, alerts.map(adaptAlert))),
            catchError(() => of(AlertActions.getAlertsError()))
          );
      })
    );
  });
}
