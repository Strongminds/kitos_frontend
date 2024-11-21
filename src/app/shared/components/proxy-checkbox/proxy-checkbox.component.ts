import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-proxy-checkbox',
  templateUrl: './proxy-checkbox.component.html',
  styleUrls: ['./proxy-checkbox.component.scss'],
})
export class ProxyCheckboxComponent implements OnInit {
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() entityUuid!: string;

  @Output() attemptChange = new EventEmitter<boolean>();

  constructor(private actions$: Actions, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.actions$
      .pipe(
        ofType(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationSuccess),
        filter(({ itSystemUuid }) => itSystemUuid === this.entityUuid)
      )
      .subscribe(() => {
        this.checked = false;
        this.cdRef.detectChanges();
      });

    this.actions$
      .pipe(
        ofType(ITSystemUsageActions.createItSystemUsageSuccess),
        filter(({ itSystemUuid }) => itSystemUuid === this.entityUuid)
      )
      .subscribe(() => {
        this.checked = true;
        this.cdRef.detectChanges();
      });
    this.cdRef.detach();
    this.cdRef.detectChanges();
  }

  public onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const attemptedValue = !this.checked;
    this.attemptChange.emit(attemptedValue);
  }
}
