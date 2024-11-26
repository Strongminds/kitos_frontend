import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, map, Observable } from 'rxjs';
import { ResetPasswordComponentStore } from './reset-password.component-store';
import { AppPath } from 'src/app/shared/enums/app-path';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  providers: [ResetPasswordComponentStore],
})
export class ResetPasswordComponent implements OnInit {
  public readonly requestId$: Observable<string> = this.route.params.pipe(map((params) => params['id']));

  public readonly email$: Observable<string | undefined> = this.componentStore.email$;
  public readonly loading$: Observable<boolean> = this.componentStore.loading$;

  public readonly routerLink = AppPath.passwordReset;
  constructor(
    private route: ActivatedRoute,
    private componentStore: ResetPasswordComponentStore
  ) {}

  public ngOnInit(): void {
    this.requestId$.pipe(first()).subscribe((requestId) => this.componentStore.getPasswordResetRequest(requestId));
  }
}
