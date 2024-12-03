import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { GridColumn } from '../../models/grid-column.model';
import { Observable } from 'rxjs';
import { GridFilterService } from '../../services/grid-filter.service';

@Component({
  selector: 'app-filter-options-button',
  templateUrl: './filter-options-button.component.html',
  styleUrl: './filter-options-button.component.scss',
})
export class FilterOptionsButtonComponent implements OnInit {
  @Input() entityType!: RegistrationEntityTypes;
  @Input() hasResetButton: boolean = false;
  @Input() gridColumns$?: Observable<GridColumn[]>;

  public disabled: boolean = false;

  constructor(private notificationService: NotificationService, private gridFilterService: GridFilterService) {}

  ngOnInit() {
    this.disabled = !this.gridFilterService.getColumnsFromLocalStorage(this.entityType);
  }

  onSaveClick() {
    this.disabled = false;
    this.gridFilterService.dispatchSaveFilterAction(this.entityType);
    this.notificationService.showDefault($localize`Filtre og sortering gemt`);
  }

  onApplyClck() {
    if (this.disabled) return;
    this.gridFilterService.dispatchApplyFilterAction(this.entityType);
    this.notificationService.showDefault($localize`Anvender gemte filtre og sortering`);
  }

  onDeleteClick() {
    if (this.disabled) return;
    this.disabled = true;
    this.gridFilterService.deleteFilterFromLocalStorage(this.entityType);
    this.notificationService.showDefault($localize`Filtre og sortering slettet`);
  }
}
