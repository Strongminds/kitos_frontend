import { Selector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  APIArchivingRegistrationsResponseDTO,
  APIYesNoDontKnowChoice,
  APIGDPRRegistrationsResponseDTO,
  APIGeneralDataResponseDTO,
} from 'src/app/api/v2';
import {
  RecommendedBadgeState,
  combineRecommendedBadgeState,
  mapUIConfigStatusToRecommended,
} from 'src/app/shared/helpers/observable-helpers';
import { selectItSystemUsageArchiving, selectItSystemUsageGdpr, selectItSystemUsageGeneral } from 'src/app/store/it-system-usage/selectors';
import {
  selectITSystemUsageEnableAndRecommendedActive,
  selectITSystemUsageEnableAndRecommendedAmountOfUsers,
  selectITSystemUsageEnableAndRecommendedArchiveDuty,
  selectITSystemUsageEnableAndRecommendedArchiveFrequency,
  selectITSystemUsageEnableAndRecommendedArchiveLocation,
  selectITSystemUsageEnableAndRecommendedArchiveSupplier,
  selectITSystemUsageEnableAndRecommendedArchiveTestLocation,
  selectITSystemUsageEnableAndRecommendedArchiveType,
  selectITSystemUsageEnableAndRecommendedContainsAITechnology,
  selectITSystemUsageEnableAndRecommendedDataClassification,
  selectITSystemUsageEnableAndRecommendedDescription,
  selectITSystemUsageEnableAndRecommendedDocumentBearing,
  selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment,
  selectITSystemUsageEnableAndRecommendedGdprDocumentation,
  selectITSystemUsageEnableAndRecommendedGdprDpiaConducted,
  selectITSystemUsageEnableAndRecommendedGdprIsDataProcessingAgreementRequired,
  selectITSystemUsageEnableAndRecommendedGdprPlannedRiskAssessmentDate,
  selectITSystemUsageEnableAndRecommendedGdprPurpose,
  selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod,
  selectITSystemUsageEnableAndRecommendedGdprTechnicalPrecautions,
  selectITSystemUsageEnableAndRecommendedGdprUserSupervision,
  selectITSystemUsageEnableAndRecommendedGeneralHostedAt,
  selectITSystemUsageEnableAndRecommendedIsBusinessCritical,
  selectITSystemUsageEnableAndRecommendedIsSociallyCritical,
  selectITSystemUsageEnableAndRecommendedLicensingAndCodeModels,
  selectITSystemUsageEnableAndRecommendedLifeCycleStatus,
  selectITSystemUsageEnableAndRecommendedCriticalityLevelDocumentation,
  selectITSystemUsageEnableAndRecommendedFrontPageUsagePeriod,
  selectITSystemUsageEnableAndRecommendedName,
  selectITSystemUsageEnableAndRecommendedNotes,
  selectITSystemUsageEnableAndRecommendedSystemId,
  selectITSystemUsageEnableAndRecommendedSystemUsageCriticalityLevel,
  selectITSystemUsageEnableAndRecommendedTechnicalSystemType,
  selectITSystemUsageEnableAndRecommendedVersion,
  selectITSystemUsageEnableAndRecommendedWebAccessibility,
} from 'src/app/store/organization/ui-module-customization/selectors';

type General = APIGeneralDataResponseDTO | undefined;
type Gdpr = APIGDPRRegistrationsResponseDTO | undefined;
type Archiving = APIArchivingRegistrationsResponseDTO | undefined;

function hasText(value: string | null | undefined): boolean {
  return !!value?.trim();
}

function hasValue<T>(value: T | null | undefined): boolean {
  return value !== null && value !== undefined;
}

function hasDependentGdprValue(choice: string | null | undefined, filled: boolean): boolean {
  return choice === APIYesNoDontKnowChoice.Yes ? filled : hasValue(choice);
}

function hasItems<T>(value: Array<T> | null | undefined): boolean {
  return !!value && value.length > 0;
}

export interface ItSystemUsageRecommendedTabBadges {
  frontpage$: Observable<RecommendedBadgeState>;
  gdpr$: Observable<RecommendedBadgeState>;
  archiving$: Observable<RecommendedBadgeState>;
}

/**
 * Computes, per tab, whether the tab has any recommended field and whether all of its
 * recommended fields are filled in - read directly from the loaded it-system usage
 * entity, so this works even for tabs the user has not (yet) navigated to.
 */
export function getItSystemUsageRecommendedTabBadges(store: Store): ItSystemUsageRecommendedTabBadges {
  const general$ = store.select(selectItSystemUsageGeneral);
  const gdpr$ = store.select(selectItSystemUsageGdpr);
  const archiving$ = store.select(selectItSystemUsageArchiving);

  const generalField = (
    recommendedSelector: Selector<object, { enabled: boolean; recommended: boolean }>,
    filled: (general: General) => boolean,
  ) => ({
    recommended$: store.select(recommendedSelector).pipe(mapUIConfigStatusToRecommended()),
    filled$: general$.pipe(map(filled)),
  });

  const gdprField = (
    recommendedSelector: Selector<object, { enabled: boolean; recommended: boolean }>,
    filled: (gdpr: Gdpr) => boolean,
  ) => ({
    recommended$: store.select(recommendedSelector).pipe(mapUIConfigStatusToRecommended()),
    filled$: gdpr$.pipe(map(filled)),
  });

  const archivingField = (
    recommendedSelector: Selector<object, { enabled: boolean; recommended: boolean }>,
    filled: (archiving: Archiving) => boolean,
  ) => ({
    recommended$: store.select(recommendedSelector).pipe(mapUIConfigStatusToRecommended()),
    filled$: archiving$.pipe(map(filled)),
  });

  const frontpage$ = combineRecommendedBadgeState([
    generalField(selectITSystemUsageEnableAndRecommendedName, (g) => hasText(g?.localCallName)),
    generalField(selectITSystemUsageEnableAndRecommendedSystemId, (g) => hasText(g?.localSystemId)),
    generalField(selectITSystemUsageEnableAndRecommendedVersion, (g) => hasText(g?.systemVersion)),
    generalField(selectITSystemUsageEnableAndRecommendedTechnicalSystemType, (g) => hasItems(g?.technicalSystemTypes)),
    generalField(selectITSystemUsageEnableAndRecommendedGeneralHostedAt, (g) => hasValue(g?.hostedAt)),
    generalField(selectITSystemUsageEnableAndRecommendedAmountOfUsers, (g) => hasValue(g?.numberOfExpectedUsers)),
    generalField(selectITSystemUsageEnableAndRecommendedDataClassification, (g) => hasValue(g?.dataClassification)),
    generalField(selectITSystemUsageEnableAndRecommendedContainsAITechnology, (g) => hasValue(g?.containsAITechnology)),
    generalField(selectITSystemUsageEnableAndRecommendedLicensingAndCodeModels, (g) =>
      hasItems(g?.licensingAndCodeModels),
    ),
    generalField(selectITSystemUsageEnableAndRecommendedGdprPurpose, (g) => hasText(g?.purpose)),
    generalField(selectITSystemUsageEnableAndRecommendedDescription, (g) => hasText(g?.notes)),
    generalField(selectITSystemUsageEnableAndRecommendedIsBusinessCritical, (g) => hasValue(g?.isBusinessCritical)),
    generalField(selectITSystemUsageEnableAndRecommendedIsSociallyCritical, (g) => hasValue(g?.isSociallyCritical)),
    generalField(selectITSystemUsageEnableAndRecommendedSystemUsageCriticalityLevel, (g) =>
      hasValue(g?.systemUsageCriticalityLevel),
    ),
    generalField(selectITSystemUsageEnableAndRecommendedCriticalityLevelDocumentation, (g) =>
      hasValue(g?.criticalityLevelDocumentation),
    ),
    generalField(selectITSystemUsageEnableAndRecommendedLifeCycleStatus, (g) => hasValue(g?.validity.lifeCycleStatus)),
    generalField(selectITSystemUsageEnableAndRecommendedFrontPageUsagePeriod, (g) => hasValue(g?.validity.validFrom)),
    generalField(selectITSystemUsageEnableAndRecommendedFrontPageUsagePeriod, (g) => hasValue(g?.validity.validTo)),
    generalField(selectITSystemUsageEnableAndRecommendedWebAccessibility, (g) =>
      hasValue(g?.webAccessibilityCompliance),
    ),
    generalField(selectITSystemUsageEnableAndRecommendedWebAccessibility, (g) =>
      hasValue(g?.lastWebAccessibilityCheck),
    ),
    generalField(selectITSystemUsageEnableAndRecommendedWebAccessibility, (g) => hasText(g?.webAccessibilityNotes)),
  ]);

  const gdprTab$ = combineRecommendedBadgeState([
    gdprField(selectITSystemUsageEnableAndRecommendedGdprPurpose, (g) => hasText(g?.processingPurpose)),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprDocumentation, (g) => hasValue(g?.directoryDocumentation)),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprIsDataProcessingAgreementRequired, (g) =>
      hasValue(g?.isDataProcessingAgreementRequired),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprPlannedRiskAssessmentDate, (g) =>
      hasValue(g?.plannedRiskAssessmentDate),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment, (g) =>
      hasValue(g?.riskAssessmentConducted),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment, (g) =>
      hasDependentGdprValue(g?.riskAssessmentConducted, hasValue(g?.riskAssessmentConductedDate)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment, (g) =>
      hasDependentGdprValue(g?.riskAssessmentConducted, hasValue(g?.riskAssessmentResult)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment, (g) =>
      hasDependentGdprValue(g?.riskAssessmentConducted, hasValue(g?.riskAssessmentDocumentation)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprConductedRiskAssessment, (g) =>
      hasDependentGdprValue(g?.riskAssessmentConducted, hasText(g?.riskAssessmentNotes)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprTechnicalPrecautions, (g) =>
      hasValue(g?.technicalPrecautionsInPlace),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprTechnicalPrecautions, (g) =>
      hasDependentGdprValue(g?.technicalPrecautionsInPlace, hasValue(g?.technicalPrecautionsDocumentation)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprUserSupervision, (g) => hasValue(g?.userSupervision)),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprUserSupervision, (g) => hasDependentGdprValue(g?.userSupervision, hasValue(g?.userSupervisionDate))),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprUserSupervision, (g) =>
      hasDependentGdprValue(g?.userSupervision, hasValue(g?.userSupervisionDocumentation)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod, (g) => hasValue(g?.retentionPeriodDefined)),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod, (g) =>
      hasDependentGdprValue(g?.retentionPeriodDefined, hasValue(g?.nextDataRetentionEvaluationDate)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprRetentionPeriod, (g) =>
      hasDependentGdprValue(g?.retentionPeriodDefined, hasValue(g?.dataRetentionEvaluationFrequencyInMonths)),
    ),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprDpiaConducted, (g) => hasValue(g?.dpiaConducted)),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprDpiaConducted, (g) => hasDependentGdprValue(g?.dpiaConducted, hasValue(g?.dpiaDate))),
    gdprField(selectITSystemUsageEnableAndRecommendedGdprDpiaConducted, (g) => hasDependentGdprValue(g?.dpiaConducted, hasValue(g?.dpiaDocumentation))),
  ]);

  const archivingTab$ = combineRecommendedBadgeState([
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveDuty, (a) => hasValue(a?.archiveDuty)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveType, (a) => hasValue(a?.type)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveLocation, (a) => hasValue(a?.location)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveSupplier, (a) => hasValue(a?.supplier)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveTestLocation, (a) => hasValue(a?.testLocation)),
    archivingField(selectITSystemUsageEnableAndRecommendedArchiveFrequency, (a) => hasValue(a?.frequencyInMonths)),
    archivingField(selectITSystemUsageEnableAndRecommendedDocumentBearing, (a) => hasValue(a?.documentBearing)),
    archivingField(selectITSystemUsageEnableAndRecommendedActive, (a) => hasValue(a?.active)),
    archivingField(selectITSystemUsageEnableAndRecommendedNotes, (a) => hasText(a?.notes)),
  ]);

  return { frontpage$, gdpr$: gdprTab$, archiving$: archivingTab$ };
}
