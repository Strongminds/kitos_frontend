import { Component } from '@angular/core';

@Component({
    selector: 'app-not-in-use-icon',
    styles: [':host {display: contents}'],
    templateUrl: './not-in-use.svg',
    standalone: false
})
export class NotInUseIconComponent {}
