export interface ITContractSupplierType {
  name: string;
  id: number; //TODO use a real backend enum
}

export const itContractSupplierTypeOptions: ITContractSupplierType[] = [
  { name: $localize`Intern`, id: 0 },
  { name: $localize`Ekstern`, id: 1 },
];

export const mapITContractSupplierType = (value?: number): ITContractSupplierType | undefined => {
  return itContractSupplierTypeOptions.find((option) => option.id === value);
};
