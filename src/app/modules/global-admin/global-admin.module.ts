import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GlobalAdminRouterModule } from './global-admin.routes';

@NgModule({
  declarations: [],
  imports: [CommonModule, ComponentsModule, SharedModule, GlobalAdminRouterModule],
})
export class GlobalAdminModule {}
