import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-table-row-actions',
    templateUrl: './table-row-actions.component.html',
    styleUrls: ['./table-row-actions.component.scss'],
    standalone: false
})
export class TableRowActionsComponent {
  @Input() public floatSide: 'left' | 'right' = 'right';
}
