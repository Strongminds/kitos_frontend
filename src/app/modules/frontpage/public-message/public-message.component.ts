import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-public-message',
  templateUrl: './public-message.component.html',
  styleUrl: './public-message.component.scss',
})
export class PublicMessageComponent {
  //eslint-disable-next-line
  @Input() content!: any;
}
