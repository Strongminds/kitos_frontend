import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
    selector: 'app-enum-cell',
    templateUrl: './enum-cell.component.html',
    styleUrl: './enum-cell.component.scss',
    standalone: false
})
export class EnumCellComponent extends BaseCellComponent {}
