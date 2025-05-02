import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationDetailsDataProcessingComponent } from './notification-details/notification-details-data-processing/notification-details-data-processing.component';
import { NotificationDetailsItContractsComponent } from './notification-details/notification-details-it-contracts/notification-details-it-contracts.component';
import { NotificationDetailsItSystemUsagesComponent } from './notification-details/notification-details-it-system-usages/notification-details-it-system-usages.component';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { AlertsGridComponent } from './notification-details/notifications-page/alerts-grid/alerts-grid.component';
import { NotificationsGridComponent } from './notification-details/notifications-page/notifications-grid/notifications-grid.component';
import { NotificationsPageComponent } from './notification-details/notifications-page/notifications-page.component';
import { NotifcationsRouterModule } from './notifications.routes';

@NgModule({
    imports: [CommonModule, ComponentsModule, RouterModule, SharedModule, NotifcationsRouterModule, NotificationDetailsComponent,
        NotificationDetailsItSystemUsagesComponent,
        NotificationDetailsItContractsComponent,
        NotificationDetailsDataProcessingComponent,
        NotificationsPageComponent,
        NotificationsGridComponent,
        AlertsGridComponent],
})
export class NotifcationsModule {}
