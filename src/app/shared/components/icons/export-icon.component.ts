import { Component } from '@angular/core';

@Component({
    selector: 'app-export-icon',
    styles: [':host {display: contents}'],
    templateUrl: './export.svg',
    standalone: false
})
export class ExportIconComponent {}
