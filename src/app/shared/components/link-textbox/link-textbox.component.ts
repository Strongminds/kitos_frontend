import { Component, EventEmitter, Input, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { validateUrl } from '../../helpers/link.helpers';
import { isEmptyOrUndefined } from '../../helpers/string.helpers';
import { SimpleLink } from '../../models/SimpleLink.model';

@Component({
  selector: 'app-link-textbox',
  templateUrl: './link-textbox.component.html',
  styleUrls: ['./link-textbox.component.scss'],
})
export class LinkTextboxComponent extends BaseComponent {
  @Input() public title!: string;
  @Input() public simpleLink$!: Observable<SimpleLink | undefined>;
  @Input() isDisabled = false;
  @Input() public isLinkOnly = false;
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() public placeholder: string | undefined = undefined;
  @Output() public iconClick = new EventEmitter<void>();
  @Output() public clearClick = new EventEmitter<void>();

  public onIconClick(): void {
    this.iconClick.emit();
  }
  public onClearClick(): void {
    this.clearClick.emit();
  }
  public openLink(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  public getLinkText(){
    return this.simpleLink$
      .pipe(map((simpleLink) => {
        const url = simpleLink?.url;
        if (this.isLinkOnly) return url;

        const name = simpleLink?.name;
        if (isEmptyOrUndefined(url) && isEmptyOrUndefined(name)) return null;

        const title = (isEmptyOrUndefined(name)) ? this.placeholder : name;
        if (this.validateSimpleLinkUrl(simpleLink?.url)) {
          return title;
        }
        return `${title}: ${simpleLink?.url}`;
      }));
  }

  public enableClearX(){
    return this.simpleLink$
      .pipe(map((simpleLink) => {
        const url = simpleLink?.url;
        const name = simpleLink?.name;
        return !(isEmptyOrUndefined(url) && isEmptyOrUndefined(name));
      }));
  }

  public hasNoLink(){
    return this.simpleLink$
      .pipe(map((simpleLink) => {
        return !simpleLink || simpleLink.url === null;
      }));
  }

  public validateSimpleLinkUrl(url: string | undefined) {
    return isEmptyOrUndefined(url) || validateUrl(url);
  }
}
