import { NgModule } from '@angular/core';
import { AppDatePipe } from './app-date.pipe';
import { SearchPropertyPipe } from './column-property.pipe';

@NgModule({
    imports: [AppDatePipe, SearchPropertyPipe],
    exports: [AppDatePipe, SearchPropertyPipe],
})
export class PipesModule {}
