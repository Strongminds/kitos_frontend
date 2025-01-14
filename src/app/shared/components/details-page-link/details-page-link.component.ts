import { Component, Input, OnInit } from '@angular/core';
import { AppPath } from '../../enums/app-path';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { LinkFontSizes } from '../../models/sizes/link-font-sizes.model';

@Component({
  selector: 'app-details-page-link',
  templateUrl: './details-page-link.component.html',
  styleUrls: ['./details-page-link.component.scss'],
})
export class DetailsPageLinkComponent implements OnInit {
  public detailsPageRouterPath: string | null = null;

  @Input() public itemUuid?: string;
  @Input() public linkFontSize: LinkFontSizes = 'medium';
  @Input() public itemType: RegistrationEntityTypes | undefined;
  @Input() public subpagePath?: string;
  @Input() public disableRedirect = false;
  @Input() public itemPathIncludesSubmodule = false;

  private setDetailsPagePath(resourceUrlSegment: string) {
    let path = `/${resourceUrlSegment}/${this.itemUuid}`;
    if (this.subpagePath) {
      path += `/${this.subpagePath}`;
    }
    this.detailsPageRouterPath = path;
  }

  private setDetailsPagePathWithSubmodule(resourceUrlSegment: string) {
    if (this.itemPathIncludesSubmodule){
      const segmentWithoutSubmodule = resourceUrlSegment.split('/')[0];
      this.setDetailsPagePath(segmentWithoutSubmodule);
      return;
    }
    this.setDetailsPagePath(resourceUrlSegment);
  }

  public ngOnInit(): void {
    const isValid = this.itemUuid != undefined && this.itemType != undefined;
    if (isValid) {
      switch (this.itemType) {
        case 'data-processing-registration':
          this.setDetailsPagePath(AppPath.dataProcessing);
          break;
        case 'it-contract':
          this.setDetailsPagePath(AppPath.itContracts);
          break;
        case 'it-interface':
          this.setDetailsPagePathWithSubmodule(`${AppPath.itSystems}/${AppPath.itInterfaces}`);
          break;
        case 'it-system':
          this.setDetailsPagePathWithSubmodule(`${AppPath.itSystems}/${AppPath.itSystemCatalog}`);
          break;
        case 'it-system-usage':
          this.setDetailsPagePathWithSubmodule(`${AppPath.itSystems}/${AppPath.itSystemUsages}`);
          break;
        case 'organization':
          this.setDetailsPagePathWithSubmodule(`${AppPath.organization}/${AppPath.structure}`);
          break;
        default:
          console.error('Unmapped link itemType', this.itemType);
      }
    } else {
      console.error('Details page link incorrectly configured. Got (uuid,type)', this.itemUuid, this.itemType);
    }
  }
}
