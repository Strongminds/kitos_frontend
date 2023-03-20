import { Component, Input, OnInit } from '@angular/core';
import { APIIdentityNamePairResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { Dictionary } from '../../models/primitives/dictionary.model';

@Component({
  selector: 'app-selected-option-type-text',
  templateUrl: './selected-option-type-text.component.html',
  styleUrls: ['./selected-option-type-text.component.scss'],
})
export class SelectedOptionTypeTextComponent implements OnInit {
  public selectedOptionText = '';
  @Input() public selectedOption?: APIIdentityNamePairResponseDTO;
  @Input() public availableOptions?: Dictionary<APIRegularOptionResponseDTO>;

  ngOnInit(): void {
    if (this.selectedOption) {
      if (!this.availableOptions) {
        console.error("Missing 'availableOptions'");
      } else {
        const availableOption = this.availableOptions[this.selectedOption.uuid];
        const obsoletedText = $localize`udgået`;
        this.selectedOptionText = availableOption?.name ?? `${this.selectedOption.name} (${obsoletedText})`;
      }
    }
  }
}
