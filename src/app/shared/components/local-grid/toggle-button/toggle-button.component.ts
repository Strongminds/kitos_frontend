import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-toggle-button',
    templateUrl: './toggle-button.component.html',
    styleUrl: './toggle-button.component.scss',
    standalone: false
})
export class ToggleButtonComponent {
  @Input() value!: boolean;

  @Output() valueChange = new EventEmitter<boolean>();

  public onToggle(): void {
    this.valueChange.emit(!this.value);
  }
}
