import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GlobalAdminDataProcessingComponent } from './global-admin-data-processing/global-admin-data-processing.component';
import { GlobalAdminGlobalAdminsComponent } from './global-admin-global-admins/global-admin-global-admins.component';
import { GlobalAdminHelpTextsComponent } from './global-admin-help-texts/global-admin-help-texts.component';
import { GlobalAdminItContractComponent } from './global-admin-it-contract/global-admin-it-contract.component';
import { GlobalAdminItSystemComponent } from './global-admin-it-system/global-admin-it-system.component';
import { GlobalAdminLocalAdminsComponent } from './global-admin-local-admins/global-admin-local-admins.component';
import { GlobalAdminOrganizationComponent } from './global-admin-organization/global-admin-organization.component';
import { CreateOrganizationDialogComponent } from './global-admin-organizations/create-organization-dialog/create-organization-dialog.component';
import { EditOrganizationDialogComponent } from './global-admin-organizations/edit-organization-dialog/edit-organization-dialog.component';
import { DeleteOrganizationDialogComponent } from './global-admin-organizations/delete-organization-dialog/delete-organization-dialog.component';
import { RemovalConflictTableComponent } from './global-admin-organizations/delete-organization-dialog/removal-conflict-table/removal-conflict-table.component';
import { InnerConflictTableComponent } from './global-admin-organizations/delete-organization-dialog/removal-conflict-table/inner-conflict-table/inner-conflict-table.component';
import { GlobalAdminOtherKleComponent } from './global-admin-other/global-admin-other-kle/global-admin-other-kle.component';


@NgModule({
  declarations: [
    GlobalAdminComponent,
    GlobalAdminOrganizationComponent,
    GlobalAdminGlobalAdminsComponent,
    GlobalAdminLocalAdminsComponent,
    GlobalAdminOrganizationsComponent,
    GlobalAdminItSystemComponent,
    GlobalAdminItContractComponent,
    GlobalAdminDataProcessingComponent,
    GlobalAdminOtherComponent,
    GlobalAdminHelpTextsComponent,
    GlobalAdminOrganizationsGridComponent,
    CreateOrganizationDialogComponent,
    EditOrganizationDialogComponent,
    DeleteOrganizationDialogComponent,
    RemovalConflictTableComponent,
    InnerConflictTableComponent,
    GlobalAdminOtherKleComponent,
  ],
  imports: [CommonModule, ComponentsModule, SharedModule, GlobalAdminRouterModule],
})
export class GlobalAdminModule {}
