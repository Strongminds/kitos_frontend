import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-contentbox',
    templateUrl: 'contentbox.component.html',
    styleUrls: ['contentbox.component.scss'],
    standalone: false
})
export class ContentBoxComponent {
  @Input() public text = '';
}
