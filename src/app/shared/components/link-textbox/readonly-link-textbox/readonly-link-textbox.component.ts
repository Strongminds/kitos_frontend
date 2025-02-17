import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-readonly-link-textbox',
  templateUrl: './readonly-link-textbox.component.html',
  styleUrl: './readonly-link-textbox.component.scss',
})
export class ReadonlyLinkTextboxComponent {
  @Input() public title!: string;
  @Input() isDisabled = false;
  @Input() public size: 'medium' | 'large' = 'large';

  @Output() public iconClick = new EventEmitter<void>();

  public onIconClick(): void {
    this.iconClick.emit();
  }
}
