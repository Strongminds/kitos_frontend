import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
    selector: 'app-audit-cell',
    templateUrl: './audit-cell.component.html',
    styleUrl: './audit-cell.component.scss',
    standalone: false
})
export class AuditCellComponent extends BaseCellComponent {}
