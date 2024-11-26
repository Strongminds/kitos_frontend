import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { finalize, mergeMap, Observable, tap } from 'rxjs';
import { APIPasswordResetResponseDTO, APIV2PasswordResetInternalINTERNALService } from 'src/app/api/v2';

interface State {
  email: string | undefined;
  loading: boolean;
}

@Injectable()
export class ResetPasswordComponentStore extends ComponentStore<State> {
  constructor(private resetPasswordService: APIV2PasswordResetInternalINTERNALService) {
    super({ email: undefined, loading: true });
  }

  public readonly email$ = this.select((state) => state.email);
  public readonly loading$ = this.select((state) => state.loading);

  public getPasswordResetRequest = this.effect((requestId$: Observable<string>) =>
    requestId$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap((requestId) => {
        return this.resetPasswordService.getSinglePasswordResetInternalV2GetPasswordReset({ requestId }).pipe(
          tap((response) => console.log(response)),
          tapResponse(
            (response: APIPasswordResetResponseDTO) => this.setEmail(response.email),
            (_) => this.setEmail(undefined)
          ),
          finalize(() => this.setLoading(false))
        );
      })
    )
  );

  public readonly setEmail = this.updater((state, email: string | undefined): State => ({ ...state, email }));

  public readonly setLoading = this.updater((state, loading: boolean): State => ({ ...state, loading }));
}
