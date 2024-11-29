import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { APIV2GdprExportReportInternalINTERNALService } from 'src/app/api/v2';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { GdprReportActions } from './actions';
import { selectGdprReportHasValidCache } from './selectors';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { adaptGdprReport } from './state';

@Injectable()
export class GdprReportEffects {
  constructor(
    private gdprReportService: APIV2GdprExportReportInternalINTERNALService,
    private actions$: Actions,
    private store: Store
  ) {}

  getGdprReport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GdprReportActions.getGDPRReport),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid),
        this.store.select(selectGdprReportHasValidCache),
      ]),
      filter(([_, __, validCache]) => !validCache),
      map(([, organizationUuid]) => organizationUuid),
      filterNullish(),
      switchMap((organizationUuid) =>
        this.gdprReportService.getManyGdprExportReportInternalV2GetGdprReport({ organizationUuid }).pipe(
          map((reports) => GdprReportActions.getGDPRReportSuccess(reports.map(adaptGdprReport))),
          catchError(() => of(GdprReportActions.getGDPRReportError()))
        )
      )
    );
  });
}
