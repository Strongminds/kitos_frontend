import { Directive, ElementRef, OnDestroy, OnInit, Optional } from '@angular/core';
import { Router, RouterLink, UrlTree } from '@angular/router';

@Directive({
  selector: '[appCtrlClick]',
})
export class CtrlClickDirective implements OnInit, OnDestroy {
  private captureClickListener!: (event: MouseEvent) => void;

  constructor(private router: Router, @Optional() private routerLink: RouterLink, private el: ElementRef) {}

  ngOnInit(): void {
    this.captureClickListener = this.onCaptureClick.bind(this);
    this.el.nativeElement.addEventListener('click', this.captureClickListener, true);
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('click', this.captureClickListener, true);
  }

  private onCaptureClick(event: MouseEvent): void {
    if (!this.routerLink) return;

    if (!(event.ctrlKey || event.button === 1)) return;

    const relativeUrl = this.router.serializeUrl(this.routerLink.urlTree ?? new UrlTree());
    const fullUrl = window.location.origin + relativeUrl;

    window.open(fullUrl, '_blank');

    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
