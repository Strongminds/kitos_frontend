import { APIIdentityNamePairResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';

export const mapOptionCrossReferenceToOptionDTO = (
  value?: APIIdentityNamePairResponseDTO
): APIRegularOptionResponseDTO | undefined => {
  return value ? { uuid: value.uuid, name: value.name, description: '' } : undefined;
};

export type ShallowOptionType = {
  uuid: string;
  name: string;
  description: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptShallowOptionType(source: any): ShallowOptionType {
  // 20/11/24 due to the OData organizations endpoint changing all field names to PascalCase, this needs to account for both uppercase and lowercase starting letters.
  if (source.Uuid){
    return {
    uuid: source.Uuid,
    name: source.Name,
    description: source.Description,
  };
  }

  if (source.uuid){
    return {
    uuid: source.uuid,
    name: source.name,
    description: source.description,
  }
  }
  throw new Error('No uuid found on source when adapting shallow option type');
}
