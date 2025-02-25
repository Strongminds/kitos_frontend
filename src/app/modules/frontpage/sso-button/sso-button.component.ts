import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sso-button',
  templateUrl: './sso-button.component.html',
  styleUrl: './sso-button.component.scss',
})
export class SsoButtonComponent {
  @Output() buttonClick = new EventEmitter<void>();

  public onButtonClick() {
    this.buttonClick.emit();
  }
}
