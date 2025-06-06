import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import {
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingUuid,
} from 'src/app/store/data-processing/selectors';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { NotificationsTableComponent } from '../../../../shared/components/notifications-table/notifications-table.component';

@Component({
  selector: 'app-data-processing-notifications',
  templateUrl: './data-processing-notifications.component.html',
  styleUrl: './data-processing-notifications.component.scss',
  imports: [CardComponent, CardHeaderComponent, NgIf, NotificationsTableComponent, AsyncPipe],
})
export class DataProcessingNotificationsComponent extends BaseComponent {
  public readonly dataProcessingUuid$ = this.store.select(selectDataProcessingUuid).pipe(filterNullish());
  public readonly hasModifyPermission$ = this.store
    .select(selectDataProcessingHasModifyPermissions)
    .pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
