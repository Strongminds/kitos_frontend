import { ONLY_DIGITS_REGEX } from '../constants/regex-constants';

export function isEmptyOrUndefined(s: string | undefined) {
  return !s || s.length === 0;
}

export function entityWithUnavailableName(name: string, available: boolean): string {
  return available ? name : $localize`${name} (Ikke tilgængeligt)`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromStringToNumber(source: any): number {
  const sourceAsNumericString = source.toString().replace(ONLY_DIGITS_REGEX, '');
  if (!sourceAsNumericString) throw new Error('Invalid input provided for conversion into number');
  return parseInt(sourceAsNumericString);
}
