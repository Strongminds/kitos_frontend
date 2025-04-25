import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './profile.component';
import { ProfileRouterModule } from './profile.routes';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, ComponentsModule, SharedModule, ProfileRouterModule],
})
export class ProfileModule {}
