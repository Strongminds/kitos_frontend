import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
    selector: 'app-uuid-to-name-cell',
    templateUrl: './uuid-to-name-cell.component.html',
    styleUrl: './uuid-to-name-cell.component.scss',
    standalone: false
})
export class UuidToNameCellComponent extends BaseCellComponent {}
