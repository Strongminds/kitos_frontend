import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { GlobalAdminComponent } from './global-admin.component';
import { GlobalAdminOrganizationComponent } from './global-admin-organization/global-admin-organization.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: GlobalAdminComponent,
    children: [
      {
        path: AppPath.root,
        pathMatch: 'full',
        redirectTo: AppPath.organization,
      },
      {
        path: AppPath.organization,
        component: GlobalAdminOrganizationComponent,
      }
    ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalAdminRouterModule {}
