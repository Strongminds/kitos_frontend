import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mapEntityTypeToRelatedEntityType } from 'src/app/shared/helpers/entity-type.helper';
import { GridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { AlertActions } from 'src/app/store/alerts/actions';
import { selectAlertsByType } from 'src/app/store/alerts/selectors';
import { Alert } from 'src/app/store/alerts/state';

@Component({
  selector: 'app-alerts-grid',
  templateUrl: './alerts-grid.component.html',
  styleUrl: './alerts-grid.component.scss',
})
export class AlertsGridComponent implements OnInit {
  @Input() entityType!: RegistrationEntityTypes;

  public alerts$!: Observable<Alert[]>;

  public readonly gridColumns: GridColumn[] = [
    {
      title: $localize`Type`,
      hidden: false,
      field: 'alertType',
    },
    {
      title: $localize`Navn`,
      hidden: false,
      field: 'name',
    },
    {
      title: $localize`Dato`,
      hidden: false,
      field: 'created',
    },
    {
      title: $localize`Besked`,
      hidden: false,
      field: 'message',
    },
    {
      field: 'Actions',
      title: ' ',
      hidden: false,
      style: 'action-buttons',
      isSticky: true,
      noFilter: true,
      extraData: [{ type: 'delete' }] as GridActionColumn[],
      width: 50,
    },
  ];

  constructor(private store: Store) {}

  ngOnInit(): void {
    const relatedEntityType = mapEntityTypeToRelatedEntityType(this.entityType);
    this.alerts$ = this.store.select(selectAlertsByType(relatedEntityType));
    this.store.dispatch(AlertActions.getAlerts(relatedEntityType));
  }

  public deleteAlert(alert: Alert): void {}
}
