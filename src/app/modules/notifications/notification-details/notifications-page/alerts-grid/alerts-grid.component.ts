import { Component, Input } from '@angular/core';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

@Component({
  selector: 'app-alerts-grid',
  templateUrl: './alerts-grid.component.html',
  styleUrl: './alerts-grid.component.scss'
})
export class AlertsGridComponent {
  @Input() entityType!: RegistrationEntityTypes;
}
