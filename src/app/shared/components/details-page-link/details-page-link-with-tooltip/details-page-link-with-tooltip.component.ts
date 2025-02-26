import { Component, Input } from '@angular/core';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { LinkFontSizes } from 'src/app/shared/models/sizes/link-font-sizes.model';

@Component({
  selector: 'app-details-page-link-with-tooltip',
  templateUrl: './details-page-link-with-tooltip.component.html',
  styleUrl: './details-page-link-with-tooltip.component.scss'
})
export class DetailsPageLinkWithTooltipComponent {
    @Input() public itemPath?: string;
    @Input() public linkFontSize: LinkFontSizes = 'medium';
    @Input() public itemType: RegistrationEntityTypes | undefined;
    @Input() public subpagePath?: string;
    @Input() public disableRedirect = false;
    @Input() public itemPathIncludesSubmodule = false;
    @Input() public toolTip!: string;
}
