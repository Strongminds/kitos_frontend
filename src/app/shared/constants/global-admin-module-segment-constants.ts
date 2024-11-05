import { SegmentButtonOption } from "../components/segment/segment.component";

export enum GlobalAdminModuleSegmentOptionType {
  RegularOptionTypes = 'RegularOptionTypes',
  RoleOptionTypes = 'RoleOptionTypes',
}

export const GlobalAdminModuleSegmentOptions: SegmentButtonOption<GlobalAdminModuleSegmentOptionType>[] = [
    { text: $localize`Lokal tilpasning af udfaldsrum`, value: GlobalAdminModuleSegmentOptionType.RegularOptionTypes },
    { text: $localize`Lokal tilpasning af roller`, value: GlobalAdminModuleSegmentOptionType.RoleOptionTypes },
]
