export function isUserLocalAdminIn(
  organizationRights: any[] | undefined,
  organizationUuid: string | undefined
): boolean {
  if (!organizationUuid || !organizationUuid) {
    return false;
  }
  const localAdminEnumValue = 1;
  console.log('organizationRights', organizationRights);
  console.log('organizationUuid', organizationUuid);
  return (
    organizationRights
      ?.filter((right) => right.organizationUuid === organizationUuid)
      .map((right) => (right as any).role)
      .includes(localAdminEnumValue) ?? false
  );
}
