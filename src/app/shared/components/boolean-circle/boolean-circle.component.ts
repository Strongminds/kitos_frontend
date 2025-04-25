import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-boolean-circle',
    templateUrl: './boolean-circle.component.html',
    styleUrl: './boolean-circle.component.scss',
    standalone: false
})
export class BooleanCircleComponent {

  @Input() value!: boolean;
  @Input() positiveTooltipText: string = '';
  @Input() negativeTooltipText: string = '';
}
