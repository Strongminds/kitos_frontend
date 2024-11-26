import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, map, Observable } from 'rxjs';
import { UserActions } from 'src/app/store/user-store/actions';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  public readonly requestId$: Observable<string> = this.route.params.pipe(
    map((params) => params['id'])
  );

  constructor(private route: ActivatedRoute, private store: Store) {}

  public ngOnInit(): void {
    this.requestId$.pipe(first()).subscribe((requestId) => {
      this.store.dispatch(UserActions.getResetPasswordRequest(requestId));
    });
  }
}
