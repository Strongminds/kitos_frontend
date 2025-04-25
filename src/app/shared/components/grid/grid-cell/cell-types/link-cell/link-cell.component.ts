import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
    selector: 'app-link-cell',
    templateUrl: './link-cell.component.html',
    styleUrl: './link-cell.component.scss',
    standalone: false
})
export class LinkCellComponent extends BaseCellComponent {}
