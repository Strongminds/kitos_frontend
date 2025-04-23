import { Component } from '@angular/core';

@Component({
    selector: 'app-info-icon',
    styles: [':host {display: contents}'],
    templateUrl: './info.svg',
    standalone: false
})
export class InfoIconComponent {}
