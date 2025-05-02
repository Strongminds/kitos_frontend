import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SharedModule } from './app/shared/shared.module';
import { LayoutModule } from './app/modules/layout/layout.module';
import { RootStoreModule } from './app/store/root-store.module';
import { ApiModule as ApiV1Module } from './app/api/v1';
import { apiConfigV1Factory, apiConfigV2Factory } from './app/api/api-config-factory';
import { ApiModule as ApiV2Module } from './app/api/v2';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, SharedModule, LayoutModule, RootStoreModule, ApiV1Module.forRoot(apiConfigV1Factory), ApiV2Module.forRoot(apiConfigV2Factory), GridModule, ExcelModule),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
    ]
})
  .catch((err) => console.error(err));
