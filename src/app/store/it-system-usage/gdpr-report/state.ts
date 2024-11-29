import { EntityState } from '@ngrx/entity';
import { APIGdprReportResponseDTO } from 'src/app/api/v2';

export interface GdprReportState extends EntityState<GdprReport> {
  cacheTime: number | undefined;
}

export interface GdprReport {}

export function adaptGdprReport(dto: APIGdprReportResponseDTO): GdprReport {
  return {};
}
