import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { LocalAdminInformationComponent } from './local-admin-information/local-admin-information.component';
import { LocalAdminComponent } from './local-admin.component';
import { LocalAdminOrganizationComponent } from './local-admin-organization/local-admin-organization.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: LocalAdminComponent,
    children: [
      {
        path: AppPath.root,
        pathMatch: 'full',
        redirectTo: AppPath.information,
      },
      {
        path: AppPath.information,
        component: LocalAdminInformationComponent,
      },
      {
        path: AppPath.organization,
        component: LocalAdminOrganizationComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalAdminRouterModule {}
