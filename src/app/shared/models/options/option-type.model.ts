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
  if (!source.Uuid) throw new Error('No uuid found on source when adapting shallow option type');
  return {
    uuid: source.Uuid,
    name: source.Name,
    description: source.Description,
  };
}
