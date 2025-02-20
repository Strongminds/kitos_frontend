import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
  selector: 'app-text-cell',
  templateUrl: './text-cell.component.html',
  styleUrl: './text-cell.component.scss',
})
export class TextCellComponent extends BaseCellComponent {}
