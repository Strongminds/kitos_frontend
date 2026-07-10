export interface ITContractSupplier {
  id: number;
  organizationId: number;
  organizationUuid: string;
  organizationName: string;
  supplierId: number;
  isInternalContract: boolean;
  supplierUuid: string;
  supplierName: string;
  supplierCvr: string;
  isSupplierDisabled: boolean;
  highestCriticalityUuid: string | null;
  highestCriticalityName: string | null;
  highestCriticalityRank: number | null;
  contractsAtHighestCriticalityCsv: string | null;
  contractsAtHighestCriticality: { uuid: string; name: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITContractSupplier = (value: any): ITContractSupplier | undefined => {
  if (!value.SupplierUuid) return;

  return {
    id: value.Id,
    organizationId: value.OrganizationId,
    organizationUuid: value.Organization.Uuid,
    organizationName: value.Organization.Name,
    supplierId: value.SupplierId,
    isInternalContract: value.IsInternalContract,
    supplierUuid: value.SupplierUuid,
    supplierName: value.SupplierName,
    supplierCvr: value.SupplierCvr,
    isSupplierDisabled: value.IsSupplierDisabled,
    highestCriticalityUuid: value.HighestCriticalityUuid,
    highestCriticalityName: value.HighestCriticalityName,
    highestCriticalityRank: value.HighestCriticalityRank,
    contractsAtHighestCriticalityCsv: value.ContractsAtHighestCriticalityCsv,
    contractsAtHighestCriticality: (value.ContractsAtHighestCriticality || []).map(
      (contract: { Uuid: string; Name: string }) => ({
        uuid: contract.Uuid,
        name: contract.Name,
      }),
    ),
  };
};
