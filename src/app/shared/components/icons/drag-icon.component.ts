import { Component } from '@angular/core';

@Component({
    selector: 'app-drag-icon',
    styles: [':host {display: contents}'],
    templateUrl: './drag.svg',
    standalone: false
})
export class DragIconComponent {}
