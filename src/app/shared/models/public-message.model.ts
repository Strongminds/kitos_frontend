import { APIPublicMessageResponseDTO } from 'src/app/api/v2';

export interface PublicMessage {}

export function adaptPublicMessage(dto: APIPublicMessageResponseDTO): PublicMessage {
  return {};
}
