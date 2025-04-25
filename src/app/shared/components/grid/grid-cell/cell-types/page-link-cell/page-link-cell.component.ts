import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
    selector: 'app-page-link-cell',
    templateUrl: './page-link-cell.component.html',
    styleUrl: './page-link-cell.component.scss',
    standalone: false
})
export class PageLinkCellComponent extends BaseCellComponent {}
