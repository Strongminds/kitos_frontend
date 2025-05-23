/**
 * OS2Kitos API - V2
 * <b><i>OBS: Dokumentation for V1 (authorize endpoint) findes ved at skifte version på dokumentet til 1 øverst på siden</i></b><br/><br/>KITOS API V2 understøtter både læse- og skriveoperationer for de væsentlige registreringsobjekter i KITOS. <br/><br/>Se mere om designet og konventionerne i API\'et her: <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/2059599873/API+Design+V2\'>API V2</a>.<br/><br/>Generelt er anvendelsen af KITOS API(er) beskrevet på projektets <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/658145384/S+dan+kommer+du+igang\'>Confluence side</a>.<br/><br/><b>KENDTE FEJL OG BEGRÆNSNINGER PÅ DENNE HJÆLPESIDE SAMT WORKAROUND</b><br/>Felter der består af lister af enum værdier vises ikke rigtigt i denne UI. Konkret vises de mulige valg ikke, men i stedet vises \'Array[string]\'. For et retvisende billede af dokumentationen anbefales derfor følgende workaround:<br/><br/>- JSON downloades via \'docs linket i toppen\'<br/>- Indholdet indsættes i anden editor f.eks. <a href=\'https://editor.swagger.io\' target=\'_blank\'>Swagger.io</a><br/><br/><b>BEMÆRK</b>: Funktionen \'Try it out\' virker p.t. ikke i den eksterne editor.
 *
 * The version of the OpenAPI document: 2
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { APIContractPaymentModelDataWriteRequestDTO } from './contractPaymentModelDataWriteRequestDTO';
import { APIContractAgreementPeriodDataWriteRequestDTO } from './contractAgreementPeriodDataWriteRequestDTO';
import { APIExternalReferenceDataWriteRequestDTO } from './externalReferenceDataWriteRequestDTO';
import { APIContractGeneralDataWriteRequestDTO } from './contractGeneralDataWriteRequestDTO';
import { APIContractResponsibleDataWriteRequestDTO } from './contractResponsibleDataWriteRequestDTO';
import { APIContractSupplierDataWriteRequestDTO } from './contractSupplierDataWriteRequestDTO';
import { APIContractProcurementDataWriteRequestDTO } from './contractProcurementDataWriteRequestDTO';
import { APIContractPaymentsDataWriteRequestDTO } from './contractPaymentsDataWriteRequestDTO';
import { APIContractTerminationDataWriteRequestDTO } from './contractTerminationDataWriteRequestDTO';
import { APIRoleAssignmentRequestDTO } from './roleAssignmentRequestDTO';

export interface APICreateNewContractRequestDTO {
  /**
   * UUID of the organization in which the contract will be created
   */
  organizationUuid: string;
  /**
   * Name of the contract.  Constraints:      - Max length: 200 characters      - Must be unique within the organization
   */
  name: string;
  /**
   * User defined external references.  The external reference marked as \"master reference\" will be shown in overviews  Constraints:      - If the list is not empty one (and only one) must be marked as the master reference.
   */
  externalReferences?: Array<APIExternalReferenceDataWriteRequestDTO>;
  /**
   * UUID of the optional parent contract  Constraints:      - Parent and child contract must belong to the same organization
   */
  parentContractUuid?: string;
  general?: APIContractGeneralDataWriteRequestDTO;
  procurement?: APIContractProcurementDataWriteRequestDTO;
  supplier?: APIContractSupplierDataWriteRequestDTO;
  responsible?: APIContractResponsibleDataWriteRequestDTO;
  /**
   * IT-System usages covered by this it-contract  Constraints:      - System usages must belong to the same organization as the it-contract      - No duplicates
   */
  systemUsageUuids?: Array<string>;
  /**
   * Data processing registrations associated with this it-contract  Constraints:      - Must belong to the same organization as the it-contract      - No duplicates
   */
  dataProcessingRegistrationUuids?: Array<string>;
  paymentModel?: APIContractPaymentModelDataWriteRequestDTO;
  agreementPeriod?: APIContractAgreementPeriodDataWriteRequestDTO;
  termination?: APIContractTerminationDataWriteRequestDTO;
  payments?: APIContractPaymentsDataWriteRequestDTO;
  /**
   * Role assignments  Constraints:      - No duplicates
   */
  roles?: Array<APIRoleAssignmentRequestDTO>;
}
