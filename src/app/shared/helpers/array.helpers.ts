export function toCsv(array: any[]): string {
  if (array.length === 0) return '';
  return array.join(', ');
}
