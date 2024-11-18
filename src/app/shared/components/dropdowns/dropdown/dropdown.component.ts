/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { combineLatest } from 'rxjs';
import { BaseDropdownComponent } from '../../../base/base-dropdown.component';

@Component({
  selector: 'app-dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
})
export class DropdownComponent<T> extends BaseDropdownComponent<T | null> implements OnInit, OnChanges {
  @Input() public considerCurrentValueObsoleteIfNotPresentInData = true;
  @Input() public appendTo: string = '';
  @Input() public clearable: boolean = true;
  @Input() public searchFn?: (search: string, item: T) => boolean;
  @Input() public showDescriptionLabel: boolean = true;
  @Output() public focusEvent = new EventEmitter();
  @Output() public openDropdown = new EventEmitter();
  @Output() public cleared = new EventEmitter();
  @Output() public blurEvent = new EventEmitter();

  override ngOnInit() {
    super.ngOnInit();

    // Add obselete value when both value and data are present if data does not contain current form value
    this.subscriptions.add(
      combineLatest([this.formValueSubject$, this.formDataSubject$]).subscribe(([value]) =>
        this.addObsoleteValueIfMissingToData(value)
      )
    );

    if (!this.formName) return;

    // Update value subject to be used in calculating obselete values
    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => this.formValueSubject$.next(value))
    );

    // Push initial values to value and data form subjects
    this.formValueSubject$.next(this.formGroup?.controls[this.formName]?.value);
    this.formDataSubject$.next(this.data ?? []);
  }

  public onFocus() {
    this.focusEvent.emit();
  }

  public onOpen() {
    this.openDropdown.emit();
  }

  public onClear() {
    this.filter$.next('');
    this.cleared.emit();
  }

  public onBlur() {
    this.blurEvent.emit();
  }

  private addObsoleteValueIfMissingToData(value?: any) {
    if (this.considerCurrentValueObsoleteIfNotPresentInData) {
      if (this.data && this.formName && this.doesDataContainValue(value)) {
        // Set generated obselete value on the form control
        const obseleteDataOption: T = { ...value, [this.textField]: $localize`${value[this.textField]} (udgået)` };
        this.formGroup?.controls[this.formName].setValue(obseleteDataOption, { emitEvent: false });
      }
    }
  }

  private doesDataContainValue(value?: any): boolean {
    if (!this.data || value === undefined || value === null) return false;
    console.log('value:', value);
    console.log('data:', this.data);
    return !this.data.some(
      (option: any) => option[this.valueField] !== undefined && option[this.valueField] === value[this.valueField]
    );
  }
}
