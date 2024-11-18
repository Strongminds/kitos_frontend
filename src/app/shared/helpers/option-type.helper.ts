import { RegularOptionType } from '../models/options/regular-option-types.model';

export function getOptionTypeName(optionType: RegularOptionType): string {
  switch (optionType) {
    //It system types
    case 'it-system_business-type':
      return $localize`Forretningstyper`;
    case 'it-system_usage-archive-location-type':
      return $localize`Arkiveringstyper`;
    case 'it-system_usage-archive-location-test-type':
      return $localize`Arkiveringsteststed`;
    case 'it-interface_data-type':
      return $localize`Datatyper`;
    case 'it-system_usage-relation-frequency-type':
      return $localize`Frekvenser`;
    case 'it-interface_interface-type':
      return $localize`Grænseflader`;
    case 'it_system_usage-gdpr-sensitive-data-type':
      return $localize`Følsomme persondata`;
    case 'it_system_usage-gdpr-registered-data-category-type':
      return $localize`Kategorier af registrerede i databehandlingen`;
    case 'it-system_usage-data-classification-type':
      return $localize`Klassifikation af data i systemet`;
    case 'it-contract_contract-type':
      return $localize`Kontrakttype`;
    default:
      throw new Error(`Option type name not implemented for e${optionType}`);
  }
}
