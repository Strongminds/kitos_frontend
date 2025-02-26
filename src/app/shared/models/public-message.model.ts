import { APIPublicMessageRequestDTO, APIPublicMessageResponseDTO } from 'src/app/api/v2';
import { HasUuid } from './has-uuid';

export interface PublicMessage extends HasUuid {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  status?: APIPublicMessageRequestDTO.StatusEnum;
  link?: string;
}

export function adaptPublicMessage(dto: APIPublicMessageResponseDTO): PublicMessage {
  return { ...dto, uuid: dto.uuid! };
}
