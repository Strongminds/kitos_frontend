/**
 * Maps organization name by appending "(udgået)" suffix if organization is disabled
 */
export function adaptOrganizationNameString(name: string, disabled?: boolean): string {
  return disabled ? `${name} ` + $localize`(udgået)` : name;
}
