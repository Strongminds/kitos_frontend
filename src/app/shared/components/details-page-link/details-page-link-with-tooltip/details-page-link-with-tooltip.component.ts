import { Component, Input, OnInit } from '@angular/core';
import { getDetailsPageLink } from 'src/app/shared/helpers/link.helpers';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { LinkFontSizes } from 'src/app/shared/models/sizes/link-font-sizes.model';

@Component({
  selector: 'app-details-page-link-with-tooltip',
  templateUrl: './details-page-link-with-tooltip.component.html',
  styleUrl: './details-page-link-with-tooltip.component.scss'
})
export class DetailsPageLinkWithTooltipComponent implements OnInit{
    @Input() public itemPath?: string;
    @Input() public linkFontSize: LinkFontSizes = 'medium';
    @Input() public itemType: RegistrationEntityTypes | undefined;
    @Input() public subpagePath?: string;
    @Input() public disableRedirect = false;
    @Input() public itemPathIncludesSubmodule = false;
    @Input() public toolTip!: string;

    public detailsPageRouterPath: string | null = null;

    public ngOnInit(): void {
        const path = getDetailsPageLink(this.itemPath, this.itemType, this.subpagePath, this.itemPathIncludesSubmodule);
        if (path) {
          this.detailsPageRouterPath = path;
        }
      }
}
