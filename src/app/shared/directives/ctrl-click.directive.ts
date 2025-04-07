import { Directive, HostListener, Optional } from '@angular/core';
import { Router, RouterLink, UrlTree } from '@angular/router';

@Directive({
  selector: '[appCtrlClick]',
})
export class CtrlClickDirective {
  constructor(private router: Router, @Optional() private routerLink: RouterLink) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log('CtrlClickDirective clicked', event);
    if (!this.routerLink) {
      return;
    }

    if (event.ctrlKey || event.metaKey || event.button === 1) {
      const relativeUrl = this.router.serializeUrl(this.routerLink.urlTree ?? new UrlTree());
      const fullUrl = window.location.origin + relativeUrl;

      window.open(fullUrl, '_blank');

      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  @HostListener('auxclick', ['$event'])
  onAuxClick(event: MouseEvent) {
    if (event.button === 1 && this.routerLink) {
      const relativeUrl = this.router.serializeUrl(this.routerLink.urlTree ?? new UrlTree());
      const fullUrl = window.location.origin + relativeUrl;
      window.open(fullUrl, '_blank');
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
