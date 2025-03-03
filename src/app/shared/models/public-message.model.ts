import { APIPublicMessageResponseDTO } from 'src/app/api/v2';
import { HasUuid } from './has-uuid';
import { mapStatusType, StatusType } from './status-type.model';

export interface PublicMessage extends HasUuid {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  status?: StatusType;
  link?: string;
}

export function adaptPublicMessage(dto: APIPublicMessageResponseDTO): PublicMessage {
  return { ...dto, uuid: dto.uuid!, status: mapStatusType(dto.status) };
}
