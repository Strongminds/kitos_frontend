import { Component } from '@angular/core';

@Component({
    selector: 'app-external-link-icon',
    styles: [':host {display: contents}'],
    templateUrl: './external-link.svg',
    standalone: false
})
export class ExternalLinkIconComponent {}
