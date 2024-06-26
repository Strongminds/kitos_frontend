import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, combineLatestWith, map, of, switchMap } from 'rxjs';
import { APIV2ItInterfaceService } from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITInterface } from 'src/app/shared/models/it-interface/it-interface.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITInterfaceActions } from './actions';
import { selectInterfaceUuid } from './selectors';

@Injectable()
export class ITInterfaceEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    private apiService: APIV2ItInterfaceService,
    private statePersistingService: StatePersistingService
  ) {}

  getItInterfaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.getITInterfaces),
      switchMap(({ odataString }) =>
        this.httpClient
          .get<OData>(
            `/odata/ItInterfaces?$expand=Interface($select=Name),
            ObjectOwner($select=Name,LastName),
            Organization($select=Name),
            ExhibitedBy($expand=ItSystem($select=Id,Name,Uuid,Disabled;$expand=BelongsTo($select=Name))),
            LastChangedByUser($select=Name,LastName),DataRows($expand=DataType($select=Name))&${odataString}&$count=true`
          )
          .pipe(
            map((data) =>
              ITInterfaceActions.getITInterfacesSuccess(compact(data.value.map(adaptITInterface)), data['@odata.count'])
            ),
            catchError(() => of(ITInterfaceActions.getITInterfacesError()))
          )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.updateGridState),
      map(({ gridState }) => ITInterfaceActions.getITInterfaces(toODataString(gridState)))
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.statePersistingService.set('it-interface-grid-columns', gridColumns);
        return ITInterfaceActions.updateGridColumnsSuccess(gridColumns);
      })
    );
  });

  getItInterface$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.getITInterface),
      switchMap(({ uuid }) =>
        this.apiService.getSingleItInterfaceV2GetItInterface({ uuid }).pipe(
          map((itInterface) => ITInterfaceActions.getITInterfaceSuccess(itInterface)),
          catchError(() => of(ITInterfaceActions.getITInterfaceError()))
        )
      )
    );
  });

  getItInterfacePermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.getITInterfacePermissions),
      switchMap(({ uuid }) =>
        this.apiService.getSingleItInterfaceV2GetItInterfacePermissions({ interfaceUuid: uuid }).pipe(
          map((permissions) => ITInterfaceActions.getITInterfacePermissionsSuccess(permissions)),
          catchError(() => of(ITInterfaceActions.getITInterfacePermissionsError()))
        )
      )
    );
  });

  getItInterfaceCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.getITInterfaceCollectionPermissions),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.apiService.getSingleItInterfaceV2GetItInterfaceCollectionPermissions({ organizationUuid }).pipe(
          map((collectionPermissions) =>
            ITInterfaceActions.getITInterfaceCollectionPermissionsSuccess(collectionPermissions)
          ),
          catchError(() => of(ITInterfaceActions.getITInterfaceCollectionPermissionsError()))
        )
      )
    );
  });

  deleteItInterface$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.deleteITInterface),
      combineLatestWith(this.store.select(selectInterfaceUuid)),
      switchMap(([_, interfaceUuid]) => {
        if (!interfaceUuid) {
          return of(ITInterfaceActions.deleteITInterfaceError());
        }
        return this.apiService.deleteSingleItInterfaceV2Delete({ uuid: interfaceUuid }).pipe(
          map(() => ITInterfaceActions.deleteITInterfaceSuccess()),
          catchError(() => of(ITInterfaceActions.deleteITInterfaceError()))
        );
      })
    );
  });

  updateItInterface$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.updateITInterface),
      combineLatestWith(this.store.select(selectInterfaceUuid).pipe(filterNullish())),
      switchMap(([{ itInterface }, interfaceUuid]) =>
        this.apiService.patchSingleItInterfaceV2Patch({ request: itInterface, uuid: interfaceUuid }).pipe(
          map((updatedItInterface) => ITInterfaceActions.updateITInterfaceSuccess(updatedItInterface)),
          catchError(() => of(ITInterfaceActions.updateITInterfaceError()))
        )
      )
    );
  });

  removeItInterfaceData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.removeITInterfaceData),
      combineLatestWith(this.store.select(selectInterfaceUuid).pipe(filterNullish())),
      switchMap(([{ uuid }, interfaceUuid]) =>
        this.apiService
          .deleteSingleItInterfaceV2DeleteDataDescription({
            uuid: interfaceUuid,
            dataDescriptionUuid: uuid,
          })
          .pipe(
            map(() => ITInterfaceActions.removeITInterfaceDataSuccess(uuid)),
            catchError(() => of(ITInterfaceActions.removeITInterfaceDataError()))
          )
      )
    );
  });

  addInterfaceData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.addITInterfaceData),
      combineLatestWith(this.store.select(selectInterfaceUuid).pipe(filterNullish())),
      switchMap(([{ data }, interfaceUuid]) =>
        this.apiService.postSingleItInterfaceV2PostDataDescription({ request: data, uuid: interfaceUuid }).pipe(
          map((response) => ITInterfaceActions.addITInterfaceDataSuccess(response)),
          catchError(() => of(ITInterfaceActions.addITInterfaceDataError()))
        )
      )
    );
  });

  updateInterfaceData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.updateITInterfaceData),
      combineLatestWith(this.store.select(selectInterfaceUuid).pipe(filterNullish())),
      switchMap(([{ dataUuid, data }, interfaceUuid]) =>
        this.apiService
          .putSingleItInterfaceV2PutDataDescription({
            uuid: interfaceUuid,
            dataDescriptionUuid: dataUuid,
            request: data,
          })
          .pipe(
            map((response) => ITInterfaceActions.updateITInterfaceDataSuccess(response)),
            catchError(() => of(ITInterfaceActions.updateITInterfaceDataError()))
          )
      )
    );
  });

  createITInterface$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITInterfaceActions.createITInterface),
      combineLatestWith(this.store.select(selectOrganizationUuid)),
      switchMap(([{ name, interfaceId, openAfterCreate }, organizationUuid]) =>
        this.apiService
          .postSingleItInterfaceV2Post({
            request: { name, interfaceId, organizationUuid },
          })
          .pipe(
            map(({ uuid }) => ITInterfaceActions.createITInterfaceSuccess(uuid, openAfterCreate)),
            catchError(() => of(ITInterfaceActions.createITInterfaceError()))
          )
      )
    );
  });
}
