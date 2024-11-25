import { APIUserDTO } from 'src/app/api/v1';

export interface User {
  id: number;
  uuid: string;
  email: string;
  fullName: string;
  isGlobalAdmin: boolean;
  organizationRights: { organizationUuid?: string; role: number }[];
}

export const adaptUser = (apiUser?: APIUserDTO): User | undefined => {
  if (apiUser?.id === undefined || apiUser?.uuid === undefined || apiUser?.email === undefined) return;

  return {
    id: apiUser.id,
    uuid: apiUser.uuid,
    email: apiUser.email,
    fullName: apiUser?.fullName ?? '',
    isGlobalAdmin: apiUser?.isGlobalAdmin ?? false,
    organizationRights:
      apiUser.organizationRights?.map((right) => ({
        organizationUuid: right.organizationUuid,
        role: (right as any).role,
      })) ?? [],
  };
};
