import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganizationRemovalConflicts } from '../delete-organization.component-store';

@Component({
  selector: 'app-copy-consequences-to-clipboard',
  templateUrl: './copy-consequences-to-clipboard.component.html',
  styleUrl: './copy-consequences-to-clipboard.component.scss'
})
export class CopyConsequencesToClipboardComponent {
  @Input() removalConflicts$!: Observable<OrganizationRemovalConflicts | undefined>;
  @Input() organizationName!: string;
}
