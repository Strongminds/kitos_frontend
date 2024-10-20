import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { APIV2DataProcessingRegistrationService } from './api/v2DataProcessingRegistration.service';
import { APIV2DataProcessingRegistrationBasisForTransferTypeService } from './api/v2DataProcessingRegistrationBasisForTransferType.service';
import { APIV2DataProcessingRegistrationCountryTypeService } from './api/v2DataProcessingRegistrationCountryType.service';
import { APIV2DataProcessingRegistrationDataResponsibleTypeService } from './api/v2DataProcessingRegistrationDataResponsibleType.service';
import { APIV2DataProcessingRegistrationInternalINTERNALService } from './api/v2DataProcessingRegistrationInternalINTERNAL.service';
import { APIV2DataProcessingRegistrationOversightTypeService } from './api/v2DataProcessingRegistrationOversightType.service';
import { APIV2DataProcessingRegistrationRoleTypeService } from './api/v2DataProcessingRegistrationRoleType.service';
import { APIV2DeltaFeedService } from './api/v2DeltaFeed.service';
import { APIV2DprLocalBasisForTransferTypesInternalINTERNALService } from './api/v2DprLocalBasisForTransferTypesInternalINTERNAL.service';
import { APIV2DprLocalCountryOptionTypesInternalINTERNALService } from './api/v2DprLocalCountryOptionTypesInternalINTERNAL.service';
import { APIV2DprLocalDataResponsibleTypesInternalINTERNALService } from './api/v2DprLocalDataResponsibleTypesInternalINTERNAL.service';
import { APIV2DprLocalOversightOptionTypesInternalINTERNALService } from './api/v2DprLocalOversightOptionTypesInternalINTERNAL.service';
import { APIV2DprLocalRoleOptionTypesInternalINTERNALService } from './api/v2DprLocalRoleOptionTypesInternalINTERNAL.service';
import { APIV2GridLocalItContractRolesINTERNALService } from './api/v2GridLocalItContractRolesINTERNAL.service';
import { APIV2ItContractService } from './api/v2ItContract.service';
import { APIV2ItContractAgreementElementTypeService } from './api/v2ItContractAgreementElementType.service';
import { APIV2ItContractAgreementExtensionOptionTypeService } from './api/v2ItContractAgreementExtensionOptionType.service';
import { APIV2ItContractContractTemplateTypeService } from './api/v2ItContractContractTemplateType.service';
import { APIV2ItContractContractTypeService } from './api/v2ItContractContractType.service';
import { APIV2ItContractCriticalityTypeService } from './api/v2ItContractCriticalityType.service';
import { APIV2ItContractInternalINTERNALService } from './api/v2ItContractInternalINTERNAL.service';
import { APIV2ItContractLocalAgreementElementTypesInternalINTERNALService } from './api/v2ItContractLocalAgreementElementTypesInternalINTERNAL.service';
import { APIV2ItContractLocalContractTypesInternalINTERNALService } from './api/v2ItContractLocalContractTypesInternalINTERNAL.service';
import { APIV2ItContractLocalCriticalityTypesInternalINTERNALService } from './api/v2ItContractLocalCriticalityTypesInternalINTERNAL.service';
import { APIV2ItContractLocalOptionExtendTypesInternalINTERNALService } from './api/v2ItContractLocalOptionExtendTypesInternalINTERNAL.service';
import { APIV2ItContractLocalPaymentFrequencyTypesInternalINTERNALService } from './api/v2ItContractLocalPaymentFrequencyTypesInternalINTERNAL.service';
import { APIV2ItContractLocalPaymentModelTypesInternalINTERNALService } from './api/v2ItContractLocalPaymentModelTypesInternalINTERNAL.service';
import { APIV2ItContractLocalPriceRegulationTypesInternalINTERNALService } from './api/v2ItContractLocalPriceRegulationTypesInternalINTERNAL.service';
import { APIV2ItContractLocalProcurementStrategyTypesInternalINTERNALService } from './api/v2ItContractLocalProcurementStrategyTypesInternalINTERNAL.service';
import { APIV2ItContractLocalPurchaseFormTypesInternalINTERNALService } from './api/v2ItContractLocalPurchaseFormTypesInternalINTERNAL.service';
import { APIV2ItContractLocalRoleOptionTypesInternalINTERNALService } from './api/v2ItContractLocalRoleOptionTypesInternalINTERNAL.service';
import { APIV2ItContractLocalTemplateTypesInternalINTERNALService } from './api/v2ItContractLocalTemplateTypesInternalINTERNAL.service';
import { APIV2ItContractLocalTerminationDeadlineTypesInternalINTERNALService } from './api/v2ItContractLocalTerminationDeadlineTypesInternalINTERNAL.service';
import { APIV2ItContractNoticePeriodMonthTypeService } from './api/v2ItContractNoticePeriodMonthType.service';
import { APIV2ItContractPaymentFrequencyTypeService } from './api/v2ItContractPaymentFrequencyType.service';
import { APIV2ItContractPaymentModelTypeService } from './api/v2ItContractPaymentModelType.service';
import { APIV2ItContractPriceRegulationTypeService } from './api/v2ItContractPriceRegulationType.service';
import { APIV2ItContractProcurementStrategyService } from './api/v2ItContractProcurementStrategy.service';
import { APIV2ItContractPurchaseTypeService } from './api/v2ItContractPurchaseType.service';
import { APIV2ItContractRoleTypeService } from './api/v2ItContractRoleType.service';
import { APIV2ItInterfaceService } from './api/v2ItInterface.service';
import { APIV2ItInterfaceInterfaceDataTypeService } from './api/v2ItInterfaceInterfaceDataType.service';
import { APIV2ItInterfaceInterfaceTypeService } from './api/v2ItInterfaceInterfaceType.service';
import { APIV2ItSystemService } from './api/v2ItSystem.service';
import { APIV2ItSystemBusinessTypeService } from './api/v2ItSystemBusinessType.service';
import { APIV2ItSystemInternalINTERNALService } from './api/v2ItSystemInternalINTERNAL.service';
import { APIV2ItSystemLocalArchiveLocationTypesInternalINTERNALService } from './api/v2ItSystemLocalArchiveLocationTypesInternalINTERNAL.service';
import { APIV2ItSystemLocalArchiveTestLocationTypesInternalINTERNALService } from './api/v2ItSystemLocalArchiveTestLocationTypesInternalINTERNAL.service';
import { APIV2ItSystemLocalArchiveTypesInternalINTERNALService } from './api/v2ItSystemLocalArchiveTypesInternalINTERNAL.service';
import { APIV2ItSystemLocalBusinessTypesInternalINTERNALService } from './api/v2ItSystemLocalBusinessTypesInternalINTERNAL.service';
import { APIV2ItSystemLocalDataTypesInternalINTERNALService } from './api/v2ItSystemLocalDataTypesInternalINTERNAL.service';
import { APIV2ItSystemLocalFrequencyTypesInternalINTERNALService } from './api/v2ItSystemLocalFrequencyTypesInternalINTERNAL.service';
import { APIV2ItSystemLocalInterfaceTypesInternalINTERNALService } from './api/v2ItSystemLocalInterfaceTypesInternalINTERNAL.service';
import { APIV2ItSystemLocalItSystemCategoriesTypesInternalINTERNALService } from './api/v2ItSystemLocalItSystemCategoriesTypesInternalINTERNAL.service';
import { APIV2ItSystemLocalRegisterTypesInternalINTERNALService } from './api/v2ItSystemLocalRegisterTypesInternalINTERNAL.service';
import { APIV2ItSystemLocalRoleOptionTypesInternalINTERNALService } from './api/v2ItSystemLocalRoleOptionTypesInternalINTERNAL.service';
import { APIV2ItSystemLocalSensitivePersonalDataTypesInternalINTERNALService } from './api/v2ItSystemLocalSensitivePersonalDataTypesInternalINTERNAL.service';
import { APIV2ItSystemUsageService } from './api/v2ItSystemUsage.service';
import { APIV2ItSystemUsageArchiveLocationTypeService } from './api/v2ItSystemUsageArchiveLocationType.service';
import { APIV2ItSystemUsageArchiveTestLocationTypeService } from './api/v2ItSystemUsageArchiveTestLocationType.service';
import { APIV2ItSystemUsageArchiveTypeService } from './api/v2ItSystemUsageArchiveType.service';
import { APIV2ItSystemUsageDataClassificationTypeService } from './api/v2ItSystemUsageDataClassificationType.service';
import { APIV2ItSystemUsageInternalINTERNALService } from './api/v2ItSystemUsageInternalINTERNAL.service';
import { APIV2ItSystemUsageMigrationINTERNALService } from './api/v2ItSystemUsageMigrationINTERNAL.service';
import { APIV2ItSystemUsageRegisteredDataCategoryTypeService } from './api/v2ItSystemUsageRegisteredDataCategoryType.service';
import { APIV2ItSystemUsageRelationFrequencyTypeService } from './api/v2ItSystemUsageRelationFrequencyType.service';
import { APIV2ItSystemUsageRoleTypeService } from './api/v2ItSystemUsageRoleType.service';
import { APIV2ItSystemUsageSensitivePersonalDataTypeService } from './api/v2ItSystemUsageSensitivePersonalDataType.service';
import { APIV2KleOptionService } from './api/v2KleOption.service';
import { APIV2NotificationINTERNALService } from './api/v2NotificationINTERNAL.service';
import { APIV2OrganizationService } from './api/v2Organization.service';
import { APIV2OrganizationGridInternalINTERNALService } from './api/v2OrganizationGridInternalINTERNAL.service';
import { APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService } from './api/v2OrganizationUnitLocalRoleOptionTypesInternalINTERNAL.service';
import { APIV2OrganizationUnitRegistrationInternalINTERNALService } from './api/v2OrganizationUnitRegistrationInternalINTERNAL.service';
import { APIV2OrganizationUnitRoleTypeService } from './api/v2OrganizationUnitRoleType.service';
import { APIV2OrganizationUnitsInternalINTERNALService } from './api/v2OrganizationUnitsInternalINTERNAL.service';
import { APIV2OrganizationsInternalINTERNALService } from './api/v2OrganizationsInternalINTERNAL.service';
import { APIV2PublicMessagesINTERNALService } from './api/v2PublicMessagesINTERNAL.service';
import { APIV2StsOrganizationSynchronizationInternalINTERNALService } from './api/v2StsOrganizationSynchronizationInternalINTERNAL.service';
import { APIV2UsersInternalINTERNALService } from './api/v2UsersInternalINTERNAL.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
