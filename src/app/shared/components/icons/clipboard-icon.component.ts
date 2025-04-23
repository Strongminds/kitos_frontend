import { Component } from '@angular/core';

@Component({
    selector: 'app-clipboard-icon',
    styles: [':host {display: contents}'],
    templateUrl: './clipboard.svg',
    standalone: false
})
export class ClipboardIconComponent {}
