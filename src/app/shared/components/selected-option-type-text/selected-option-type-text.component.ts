import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { Dictionary } from '../../models/primitives/dictionary.model';

export interface BaseSelectedOptionTypeTextModel {
  uuid: string;
  name: string;
}

@Component({
  selector: 'app-selected-option-type-text[availableOptions]',
  templateUrl: './selected-option-type-text.component.html',
  styleUrls: ['./selected-option-type-text.component.scss'],
})
export class SelectedOptionTypeTextComponent<T extends BaseSelectedOptionTypeTextModel> extends BaseComponent implements OnInit {
  public selectedOptionText = '';
  @Input() public selectedOption?: T;
  @Input() public availableOptions!: Dictionary<T>;
  @Input() public rolesDictionaryObservable$!: Observable<Dictionary<T> | undefined>;

  ngOnInit(): void {
    this.subscriptions.add(
      this.rolesDictionaryObservable$.subscribe((rolesDict) => {
        if (rolesDict){
          this.availableOptions = rolesDict;
        if (this.selectedOption) {
          this.selectedOptionText = this.getOptionName(this.selectedOption.uuid, this.selectedOption.name);
        }
        }
      })
    );

    if (this.selectedOption) {
      this.selectedOptionText = this.getOptionName(this.selectedOption.uuid, this.selectedOption.name);
    }
  }

  private getOptionName(optionUuid: string, optionName: string): string {
    const availableOption = this.availableOptions[optionUuid];
    // console.log("selected option: " + JSON.stringify(this.selectedOption));
    // console.log("options: " + JSON.stringify(this.availableOptions));
    const obsoletedText = $localize`udgået`;
    return availableOption?.name ?? `${optionName} (${obsoletedText})`;
  }
}
