import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive()
export class HasSubscriptions implements OnDestroy {
  public subscriptions = new Subscription();

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
