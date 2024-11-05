import { RegularOptionType } from "./regular-option-types.model";
import { RoleOptionTypes } from "./role-option-types.model";

export interface GlobalAdminOptionTypeItem {
  uuid: string;
  enabled: boolean;
  name: string;
  writeAccess: boolean | undefined;
  description: string | undefined;
  obligatory: boolean;
  priority: number;
}

export type GlobalAdminOptionType = RegularOptionType | RoleOptionTypes;
