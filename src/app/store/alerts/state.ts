import { EntityState } from '@ngrx/entity';
import { APIAlertResponseDTO } from 'src/app/api/v2';

export interface AlertsState {
  alerts: { [key in RelatedEntityType]: EntityState<Alert> };
}

export enum RelatedEntityType {
  ItSystemUsage = 'ItSystemUsage',
  ItContract = 'ItContract',
  DataProcessingRegistration = 'DataProcessingRegistration',
}

export interface Alert {
  uuid: string;
  name?: string;
  alertType: APIAlertResponseDTO.AlertTypeEnum;
  message?: string;
  created?: string;
}

export function adaptAlert(alert: APIAlertResponseDTO): Alert {
  return {
    uuid: alert.uuid,
    name: alert.name,
    alertType: alert.alertType ?? 'Advis', //The only alert type atm (11/12/2024)
    message: alert.message,
    created: alert.created,
  };
}
