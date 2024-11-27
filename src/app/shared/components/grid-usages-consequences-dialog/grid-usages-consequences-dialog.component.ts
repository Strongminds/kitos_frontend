import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid-usages-consequences-dialog',
  templateUrl: './grid-usages-consequences-dialog.component.html',
  styleUrl: './grid-usages-consequences-dialog.component.scss'
})
export class GridUsagesConsequencesDialogComponent {
  @Input() public title!: string;
  @Input() public targetItSystemUuid!: string;

}
