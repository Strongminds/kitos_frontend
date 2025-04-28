import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-chip',
    templateUrl: 'chip.component.html',
    styleUrls: ['chip.component.scss'],
    standalone: false
})
export class ChipComponent {
  @Input() public state: 'success' | 'error' | 'neutral' = 'success';
}
