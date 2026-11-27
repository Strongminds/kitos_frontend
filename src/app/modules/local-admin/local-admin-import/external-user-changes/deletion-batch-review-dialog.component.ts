import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { from, mergeMap, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { IconButtonComponent } from 'src/app/shared/components/buttons/icon-button/icon-button.component';
import { ChipComponent } from 'src/app/shared/components/chip/chip.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ScrollbarDialogComponent } from 'src/app/shared/components/dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { ArrowRightIconComponent } from 'src/app/shared/components/icons/arrow-right-icon.component';
import { XIconComponent } from 'src/app/shared/components/icons/x-icon.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { NativeTableComponent } from 'src/app/shared/components/native-table/native-table.component';
import { ParagraphComponent } from 'src/app/shared/components/paragraph/paragraph.component';
import { TableRowActionsComponent } from 'src/app/shared/components/table-row-actions/table-row-actions.component';
import {
  type UserDeletionReview,
  UserDeletionReviewStatus,
} from 'src/app/shared/models/organization/organization-user/user-deletion-review.types';
import { type ChipContent, ChipState } from 'src/app/shared/models/status/chip.types';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';

const CONCURRENT_USER_LOOKUPS = 5;

@Component({
  selector: 'app-deletion-batch-review-dialog',
  templateUrl: './deletion-batch-review-dialog.component.html',
  imports: [
    ScrollbarDialogComponent,
    NativeTableComponent,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
    LoadingComponent,
    TableRowActionsComponent,
    IconButtonComponent,
    ArrowRightIconComponent,
    XIconComponent,
    ChipComponent,
  ],
})
export class DeletionBatchReviewDialogComponent extends BaseComponent implements OnInit {
  @ViewChild('cancelButton') private cancelButton?: ButtonComponent;
  @ViewChild('continueButton') private continueButton?: ButtonComponent;
  public readonly reviewLabel = $localize`Gennemgå`;
  public readonly skipRemainingRolesLabel = $localize`Spring roller over`;
  private readonly statusChips = {
    blocked: { state: ChipState.Error, label: $localize`Blokeret` },
    ready: { state: ChipState.Success, label: $localize`Klar` },
    rolesSkipped: { state: ChipState.Warning, label: $localize`Roller fravalgt` },
    needsReview: { state: ChipState.Error, label: $localize`Til gennemgang` },
  } satisfies Record<string, ChipContent>;
  private readonly skipped = new Set<UserDeletionReview>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly reviews: UserDeletionReview[],
    private readonly dialogRef: MatDialogRef<DeletionBatchReviewDialogComponent, boolean>,
    private readonly dialogOpener: DialogOpenerService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      from(new Set(this.reviews)).pipe(
        mergeMap((review) => review.reload(), CONCURRENT_USER_LOOKUPS),
        takeUntil(this.dialogRef.beforeClosed()),
      ).subscribe(),
    );
  }

  public canReview(review: UserDeletionReview): boolean {
    const state = review.state$.value;
    return state.status === UserDeletionReviewStatus.Ready && state.hasRoles;
  }

  public get isLoading(): boolean {
    return this.reviews.some((review) => review.state$.value.status === UserDeletionReviewStatus.Loading);
  }

  public get canContinue(): boolean {
    return this.reviews.every((review) => {
      const state = review.state$.value;
      return state.status === UserDeletionReviewStatus.Ready && (!state.hasRoles || this.skipped.has(review));
    });
  }

  public canSkip(review: UserDeletionReview): boolean {
    return this.canReview(review) && !this.skipped.has(review);
  }

  public skipRemainingRoles(review: UserDeletionReview, reviewButton: IconButtonComponent): void {
    if (!this.canSkip(review)) return;
    this.skipped.add(review);
    reviewButton.focus();
  }

  public statusChip(review: UserDeletionReview): ChipContent | undefined {
    const state = review.state$.value;
    switch (state.status) {
      case UserDeletionReviewStatus.Loading:
        return undefined;
      case UserDeletionReviewStatus.Blocked:
        return this.statusChips.blocked;
      case UserDeletionReviewStatus.Ready:
        if (!state.hasRoles) return this.statusChips.ready;
        return this.skipped.has(review) ? this.statusChips.rolesSkipped : this.statusChips.needsReview;
    }
  }

  public openReview(review: UserDeletionReview, trigger: IconButtonComponent): void {
    const child = this.dialogOpener.openDeletionReviewRoleTransfer(review);
    if (!child) return;
    this.skipped.delete(review);
    this.subscriptions.add(this.dialogRef.beforeClosed().pipe(takeUntil(child.afterClosed())).subscribe(() => child.close()));
    this.subscriptions.add(child.afterClosed().pipe(takeUntil(this.dialogRef.beforeClosed())).subscribe(() => {
      if (this.canReview(review)) {
        trigger.focus();
      } else {
        (this.canContinue ? this.continueButton : this.cancelButton)?.focus();
      }
    }));
  }

  public close(): void {
    this.dialogRef.close();
  }

  public continue(): void {
    if (this.canContinue) this.dialogRef.close(true);
  }
}
