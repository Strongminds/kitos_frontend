import { RegularOptionType } from '../models/options/regular-option-types.model';

export function getOptionTypeName(optionType: RegularOptionType): string {
  switch (optionType) {
    default:
      return 'Placeholder';
  }
}
