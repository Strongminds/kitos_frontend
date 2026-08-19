import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recommended-badge',
  imports: [],
  templateUrl: './recommended-badge.component.html',
  styleUrls: ['./recommended-badge.component.scss'],
})
export class RecommendedBadgeComponent {
  @Input() public visible: boolean = false;
  @Input() public filled: boolean = false;

}
