import { Component, Input } from '@angular/core';
import { ChipState } from '../../models/status/chip.types';

@Component({
  selector: 'app-chip',
  templateUrl: 'chip.component.html',
  styleUrls: ['chip.component.scss'],
})
export class ChipComponent {
  @Input() public state: ChipState = ChipState.Success;
}
