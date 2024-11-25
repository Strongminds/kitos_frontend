import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { FrontpageComponent } from './frontpage.component';
import { NgModule } from '@angular/core';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: FrontpageComponent,
  },
  {
    path: AppPath.passwordReset,
    component: ResetPasswordPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontpageRouterModule {}
