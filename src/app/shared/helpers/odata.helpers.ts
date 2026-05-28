export function fromOneToTwoContains(odataString: string, original: string, extra: string): string {
  const pattern = new RegExp(String.raw`contains\(${original},([^)]+)\)`, 'gi');
  const replacement = `(contains(${original},$1) or contains(${extra},$1))`;
  return odataString.replace(pattern, replacement);
}
