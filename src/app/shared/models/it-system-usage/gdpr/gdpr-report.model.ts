import { APIGdprReportResponseDTO } from 'src/app/api/v2';

export interface GdprReport {}

export function adaptGdprReport(dto: APIGdprReportResponseDTO): GdprReport {
  return {};
}
