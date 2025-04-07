import { Directive, HostListener, Optional } from '@angular/core';
import { Router, RouterLink, UrlTree } from '@angular/router';

@Directive({
  selector: '[appCtrlClick]',
})
export class CtrlClickDirective {
  constructor(private router: Router, @Optional() private routerLink: RouterLink) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (event.ctrlKey) {
      this.openUrlInNewTab(event);
    }
  }

  @HostListener('auxclick', ['$event'])
  onAuxClick(event: MouseEvent) {
    if (event.button === 1) {
      this.openUrlInNewTab(event);
    }
  }

  private openUrlInNewTab(event: MouseEvent): void {
    if (!this.routerLink) {
      return;
    }

    const relativeUrl = this.router.serializeUrl(this.routerLink.urlTree ?? new UrlTree());
    const fullUrl = window.location.origin + relativeUrl;

    window.open(fullUrl, '_blank');
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
