import { APIRecommendedArchiveDutyChoice } from 'src/app/api/v2';
import {
  ARCHIVE_B_TYPE_TEXT,
  ARCHIVE_BK_TYPE_TEXT,
  ARCHIVE_K_TYPE_TEXT,
  ARCHIVE_KB_TYPE_TEXT,
  ARCHIVE_KD_TYPE_TEXT,
  ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
  ARCHIVE_TEXT_NO_RECOMMENDATION,
} from '../../constants/archive.constants';

export interface ArchiveDutyRecommendationChoice {
  name: string;
  value: APIRecommendedArchiveDutyChoice;
}

export const archiveDutyRecommendationChoiceOptions: ArchiveDutyRecommendationChoice[] = [
  {
    name: ARCHIVE_B_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.NUMBER_1,
  },
  {
    name: ARCHIVE_BK_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.NUMBER_5,
  },
  {
    name: ARCHIVE_K_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.NUMBER_2,
  },
  {
    name: ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
    value: APIRecommendedArchiveDutyChoice.NUMBER_4,
  },
  {
    name: ARCHIVE_KD_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.NUMBER_6,
  },
  {
    name: ARCHIVE_KB_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.NUMBER_7,
  },
  {
    name: ARCHIVE_TEXT_NO_RECOMMENDATION,
    value: APIRecommendedArchiveDutyChoice.NUMBER_3,
  },
];

export const mapArchiveDutyRecommendationChoice = (
  value?: APIRecommendedArchiveDutyChoice,
): ArchiveDutyRecommendationChoice | undefined => {
  return archiveDutyRecommendationChoiceOptions.find((option) => option.value === value);
};
