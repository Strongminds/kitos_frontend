export function isEmptyOrUndefined(s: string | undefined) {
  return !s || s.length === 0;
}

export function entityWithUnavailableName(name: string, available: boolean): string {
  return available ? name : $localize`${name} (Ikke tilgængeligt)`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toNumberWithoutThousandsSeparators(source: any): number {
  const sourceAsNumericString = source.toString().replace(/[^0-9]/g, '');
  if (!sourceAsNumericString) throw new Error('Invalid input provided for conversion into number');
  return parseInt(sourceAsNumericString);
}
