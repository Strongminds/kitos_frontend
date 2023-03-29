import { Component, Input, OnInit } from '@angular/core';
import { validateUrl } from '../../helpers/link.helpers';
import { LinkFontSizes } from '../../models/sizes/link-font-sizes.model';

@Component({
  selector: 'app-external-page-link',
  templateUrl: './external-page-link.component.html',
  styleUrls: ['./external-page-link.component.scss'],
})
export class ExternalPageLinkComponent implements OnInit {
  @Input() public url: string | undefined = '';
  @Input() public linkFontSize: LinkFontSizes = 'medium';
  @Input() public title = '';

  public isValidLink = false;

  ngOnInit() {
    this.isValidLink = validateUrl(this.url);

    if (this.title === '' && typeof this.url === 'string') this.title = this.url;
  }
}
