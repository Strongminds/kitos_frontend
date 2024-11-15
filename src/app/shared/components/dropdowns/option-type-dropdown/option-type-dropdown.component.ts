import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';
import { OptionTypeDropdownComponentStore } from './option-type-dropdown-component-store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';

@Component({
  selector: 'app-option-type-dropdown',
  templateUrl: './option-type-dropdown.component.html',
  styleUrl: './option-type-dropdown.component.scss',
  providers: [OptionTypeDropdownComponentStore],
})
export class OptionTypeDropdownComponent extends BaseComponent implements OnInit {
  @Input() optionType!: RegularOptionType;
  @Input() formGroup?: FormGroup;
  @Input() formName?: string;

  @Output() valueChange = new EventEmitter<APIRegularOptionResponseDTO | null | undefined>();

  public readonly optionTypes$ = this.componentStore.optionTypes$;

  constructor(private componentStore: OptionTypeDropdownComponentStore) {
    super();
  }

  public ngOnInit(): void {
    this.componentStore.getOptionTypes(this.optionType);
  }

  public getDropdownTitle(): string {
    switch (this.optionType) {
      default:
        return 'Placeholder';
    }
  }

  public onValueChange(item: APIRegularOptionResponseDTO | null | undefined): void {
    this.valueChange.emit(item);
  }
}
