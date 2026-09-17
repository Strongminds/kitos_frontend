import { Selector, Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIDataProcessingRegistrationResponseDTO, APIYesNoIrrelevantChoice } from 'src/app/api/v2';
import {
  RecommendedBadgeState,
  combineRecommendedBadgeState,
  mapUIConfigStatusToRecommended,
} from 'src/app/shared/helpers/observable-helpers';
import { selectDataProcessing } from 'src/app/store/data-processing/selectors';
import {
  selectDprEnableAndRecommendedAgreementConcluded,
  selectDprEnableAndRecommendedDataResponsible,
  selectDprEnableAndRecommendedLastChangedAt,
  selectDprEnableAndRecommendedLastChangedBy,
  selectDprEnableAndRecommendedName,
  selectDprEnableAndRecommendedOversightInterval,
  selectDprEnableAndRecommendedOversightOptions,
  selectDprEnableAndRecommendedResponsibleOrgUnit,
  selectDprEnableAndRecommendedScheduledInspectionDate,
  selectDprEnableAndRecommendedStatus,
  selectDprEnableAndRecommendedTransferBasis,
} from 'src/app/store/organization/ui-module-customization/selectors';

type DataProcessing = APIDataProcessingRegistrationResponseDTO | undefined;

function hasText(value: string | null | undefined): boolean {
  return !!value?.trim();
}

function hasValue<T>(value: T | null | undefined): boolean {
  return value !== null && value !== undefined;
}

export interface DataProcessingRecommendedTabBadges {
  frontpage$: Observable<RecommendedBadgeState>;
  oversight$: Observable<RecommendedBadgeState>;
}

/**
 * Computes, per tab, whether the tab has any recommended field and whether all of its
 * recommended fields are filled in - read directly from the loaded data processing
 * registration, so this works even for tabs the user has not (yet) navigated to.
 */
export function getDataProcessingRecommendedTabBadges(store: Store): DataProcessingRecommendedTabBadges {
  const dpr$ = store.select(selectDataProcessing);

  const field = (
    recommendedSelector: Selector<object, { enabled: boolean; recommended: boolean }>,
    filled: (dpr: DataProcessing) => boolean,
  ) => ({
    recommended$: store.select(recommendedSelector).pipe(mapUIConfigStatusToRecommended()),
    filled$: dpr$.pipe(map(filled)),
  });

  const agreementConcludedRecommended$ = store
    .select(selectDprEnableAndRecommendedAgreementConcluded)
    .pipe(mapUIConfigStatusToRecommended());
  const isAgreementConcludedYes$ = dpr$.pipe(
    map((dpr) => dpr?.general.isAgreementConcluded === APIYesNoIrrelevantChoice.Yes),
  );
  const agreementConclusionDateRecommended$ = combineLatest([
    agreementConcludedRecommended$,
    isAgreementConcludedYes$,
  ]).pipe(map(([recommended, isYes]) => recommended && isYes));

  const frontpage$ = combineRecommendedBadgeState([
    field(selectDprEnableAndRecommendedName, (dpr) => hasText(dpr?.name)),
    field(selectDprEnableAndRecommendedDataResponsible, (dpr) => hasValue(dpr?.general.dataResponsible)),
    field(selectDprEnableAndRecommendedDataResponsible, (dpr) => hasText(dpr?.general.dataResponsibleRemark)),
    field(selectDprEnableAndRecommendedStatus, (dpr) => hasValue(dpr?.general.validity.valid)),
    field(selectDprEnableAndRecommendedLastChangedBy, (dpr) => hasText(dpr?.lastModifiedBy?.name)),
    field(selectDprEnableAndRecommendedLastChangedAt, (dpr) => hasValue(dpr?.lastModified)),
    field(selectDprEnableAndRecommendedResponsibleOrgUnit, (dpr) => hasValue(dpr?.general.responsibleOrganizationUnit)),
    field(selectDprEnableAndRecommendedTransferBasis, (dpr) => hasValue(dpr?.general.basisForTransfer)),
    {
      recommended$: agreementConcludedRecommended$,
      filled$: dpr$.pipe(map((dpr) => hasValue(dpr?.general.isAgreementConcluded))),
    },
    {
      recommended$: agreementConclusionDateRecommended$,
      filled$: dpr$.pipe(map((dpr) => hasValue(dpr?.general.agreementConcludedAt))),
    },
    {
      recommended$: agreementConcludedRecommended$,
      filled$: dpr$.pipe(map((dpr) => hasText(dpr?.general.isAgreementConcludedRemark))),
    },
  ]);

  const oversight$ = combineRecommendedBadgeState([
    field(selectDprEnableAndRecommendedOversightInterval, (dpr) => hasValue(dpr?.oversight.oversightInterval)),
    field(selectDprEnableAndRecommendedOversightInterval, (dpr) => hasText(dpr?.oversight.oversightIntervalRemark)),
    field(
      selectDprEnableAndRecommendedScheduledInspectionDate,
      (dpr) => hasValue(dpr?.oversight.oversightScheduledInspectionDate),
    ),
    field(selectDprEnableAndRecommendedOversightOptions, (dpr) => hasText(dpr?.oversight.oversightOptionsRemark)),
  ]);

  return { frontpage$, oversight$ };
}
