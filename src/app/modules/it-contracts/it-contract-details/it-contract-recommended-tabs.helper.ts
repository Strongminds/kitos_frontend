import { Selector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIItContractResponseDTO } from 'src/app/api/v2';
import {
  RecommendedBadgeState,
  combineRecommendedBadgeState,
  mapUIConfigStatusToRecommended,
} from 'src/app/shared/helpers/observable-helpers';
import { selectContract } from 'src/app/store/it-contract/selectors';
import {
  selectItContractEnableAndRecommendContractName,
  selectItContractEnableAndRecommendedContractId,
  selectItContractEnableAndRecommendExternalContactPerson,
  selectItContractEnableAndRecommendExternalContactPersonEmail,
  selectItContractEnableAndRecommendExternalContactPersonPhone,
  selectItContractsEnableAndRecommendedAgreementDeadlines,
  selectItContractsEnableAndRecommendedAgreementPeriod,
  selectItContractsEnableAndRecommendedContractType,
  selectItContractsEnableAndRecommendedCriticality,
  selectItContractsEnableAndRecommendedExternalSigner,
  selectItContractsEnableAndRecommendedInternalSigner,
  selectItContractsEnableAndRecommendedNotes,
  selectItContractsEnableAndRecommendedPaymentModel,
  selectItContractsEnableAndRecommendedProcurementPlan,
  selectItContractsEnableAndRecommendedProcurementStrategy,
  selectItContractsEnableAndRecommendedPurchaseForm,
  selectItContractsEnableAndRecommendedResponsibleUnit,
  selectItContractsEnableAndRecommendedSupplier,
  selectItContractsEnableAndRecommendedTemplate,
  selectItContractsEnableAndRecommendedTermination,
} from 'src/app/store/organization/ui-module-customization/selectors';

type Contract = APIItContractResponseDTO | undefined;

function hasText(value: string | null | undefined): boolean {
  return !!value?.trim();
}

function hasValue<T>(value: T | null | undefined): boolean {
  return value !== null && value !== undefined;
}

export interface ItContractRecommendedTabBadges {
  frontpage$: Observable<RecommendedBadgeState>;
  deadlines$: Observable<RecommendedBadgeState>;
  economy$: Observable<RecommendedBadgeState>;
}

/**
 * Computes, per tab, whether the tab has any recommended field and whether all of its
 * recommended fields are filled in - read directly from the loaded contract, so this works
 * even for tabs the user has not (yet) navigated to.
 */
export function getItContractRecommendedTabBadges(store: Store): ItContractRecommendedTabBadges {
  const contract$ = store.select(selectContract);

  const field = (
    recommendedSelector: Selector<object, { enabled: boolean; recommended: boolean }>,
    filled: (contract: Contract) => boolean,
  ) => ({
    recommended$: store.select(recommendedSelector).pipe(mapUIConfigStatusToRecommended()),
    filled$: contract$.pipe(map(filled)),
  });

  const frontpage$ = combineRecommendedBadgeState([
    field(selectItContractEnableAndRecommendContractName, (c) => hasText(c?.name)),
    field(selectItContractEnableAndRecommendedContractId, (c) => hasText(c?.general.contractId)),
    field(selectItContractsEnableAndRecommendedContractType, (c) => hasValue(c?.general.contractType)),
    field(selectItContractsEnableAndRecommendedTemplate, (c) => hasValue(c?.general.contractTemplate)),
    field(selectItContractsEnableAndRecommendedCriticality, (c) => hasValue(c?.general.criticality)),
    field(selectItContractsEnableAndRecommendedPurchaseForm, (c) => hasValue(c?.procurement.purchaseType)),
    field(selectItContractsEnableAndRecommendedAgreementPeriod, (c) => hasValue(c?.general.validity.validFrom)),
    field(selectItContractsEnableAndRecommendedAgreementPeriod, (c) => hasValue(c?.general.validity.validTo)),
    field(selectItContractsEnableAndRecommendedNotes, (c) => hasText(c?.general.notes)),
    field(selectItContractsEnableAndRecommendedResponsibleUnit, (c) => hasValue(c?.responsible.organizationUnit)),
    field(selectItContractsEnableAndRecommendedInternalSigner, (c) => hasText(c?.responsible.signedBy)),
    field(selectItContractsEnableAndRecommendedInternalSigner, (c) => hasValue(c?.responsible.signedAt)),
    field(selectItContractEnableAndRecommendExternalContactPerson, (c) => hasText(c?.supplier.contactPerson)),
    field(selectItContractEnableAndRecommendExternalContactPersonPhone, (c) => hasText(c?.supplier.contactPhoneNumber)),
    field(selectItContractEnableAndRecommendExternalContactPersonEmail, (c) => hasText(c?.supplier.contactEmail)),
    field(selectItContractsEnableAndRecommendedSupplier, (c) => hasValue(c?.supplier.organization)),
    field(selectItContractsEnableAndRecommendedExternalSigner, (c) => hasText(c?.supplier.signedBy)),
    field(selectItContractsEnableAndRecommendedExternalSigner, (c) => hasValue(c?.supplier.signedAt)),
    field(selectItContractsEnableAndRecommendedProcurementStrategy, (c) => hasValue(c?.procurement.procurementStrategy)),
    field(selectItContractsEnableAndRecommendedProcurementPlan, (c) => hasValue(c?.procurement.procurementPlan)),
  ]);

  const deadlines$ = combineRecommendedBadgeState([
    field(selectItContractsEnableAndRecommendedAgreementDeadlines, (c) => hasValue(c?.agreementPeriod.durationYears)),
    field(selectItContractsEnableAndRecommendedAgreementDeadlines, (c) => hasValue(c?.agreementPeriod.durationMonths)),
    field(selectItContractsEnableAndRecommendedAgreementDeadlines, (c) => hasValue(c?.agreementPeriod.extensionOptions)),
    field(selectItContractsEnableAndRecommendedAgreementDeadlines, (c) => hasValue(c?.agreementPeriod.extensionOptionsUsed)),
    field(selectItContractsEnableAndRecommendedAgreementDeadlines, (c) => hasValue(c?.agreementPeriod.irrevocableUntil)),
    field(selectItContractsEnableAndRecommendedTermination, (c) => hasValue(c?.termination.terminatedAt)),
    field(selectItContractsEnableAndRecommendedTermination, (c) => hasValue(c?.termination.terms.noticePeriodMonths)),
    field(selectItContractsEnableAndRecommendedTermination, (c) => hasValue(c?.termination.terms.noticePeriodExtendsCurrent)),
    field(selectItContractsEnableAndRecommendedTermination, (c) => hasValue(c?.termination.terms.noticeByEndOf)),
  ]);

  const economy$ = combineRecommendedBadgeState([
    field(selectItContractsEnableAndRecommendedPaymentModel, (c) => hasValue(c?.paymentModel.operationsRemunerationStartedAt)),
    field(selectItContractsEnableAndRecommendedPaymentModel, (c) => hasValue(c?.paymentModel.paymentFrequency)),
    field(selectItContractsEnableAndRecommendedPaymentModel, (c) => hasValue(c?.paymentModel.paymentModel)),
    field(selectItContractsEnableAndRecommendedPaymentModel, (c) => hasValue(c?.paymentModel.priceRegulation)),
  ]);

  return { frontpage$, deadlines$, economy$ };
}
