import { APIPublicMessageRequestDTO, APIPublicMessageResponseDTO } from 'src/app/api/v2';
import { HasUuid } from './has-uuid';

export interface PublicMessage extends HasUuid {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  status?: boolean;
  link?: string;
}

export function adaptPublicMessage(dto: APIPublicMessageResponseDTO): PublicMessage {
  return { ...dto, uuid: dto.uuid!, status: adaptStatusType(dto.status) };
}

function adaptStatusType(status?: APIPublicMessageResponseDTO.StatusEnum): boolean | undefined {
  if (!status) return undefined;
  switch (status) {
    case APIPublicMessageResponseDTO.StatusEnum.Active:
      return true;
    case APIPublicMessageResponseDTO.StatusEnum.Inactive:
      return false;
    default:
      throw new Error(`Unknown status type: ${status}`);
  }
}
