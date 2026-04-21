import { APIRecommendedArchiveDutyChoice, APIRecommendedArchiveDutyResponseDTO } from 'src/app/api/v2';
import {
  ARCHIVE_B_TYPE_TEXT,
  ARCHIVE_K_TYPE_TEXT,
  ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
  ARCHIVE_TEXT_NO_RECOMMENDATION,
} from '../constants/archive.constants';

export const mapRecommendedArchiveDutyToString = (value: APIRecommendedArchiveDutyResponseDTO): string | undefined => {
  switch (value.id) {
    case APIRecommendedArchiveDutyChoice.NUMBER_0:
      return undefined;
    case APIRecommendedArchiveDutyChoice.NUMBER_3:
      return ARCHIVE_TEXT_NO_RECOMMENDATION;
    case APIRecommendedArchiveDutyChoice.NUMBER_1:
      return ARCHIVE_B_TYPE_TEXT;
    case APIRecommendedArchiveDutyChoice.NUMBER_2:
      return ARCHIVE_K_TYPE_TEXT;
    case APIRecommendedArchiveDutyChoice.NUMBER_4:
      return ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT;
    default:
      throw new Error(`Unknown archive duty recommendation: ${value.id}`);
  }
};

export const mapRecommendedArchiveDutyComment = (value: APIRecommendedArchiveDutyResponseDTO): string => {
  if (value.id === APIRecommendedArchiveDutyChoice.NUMBER_0) return '';
  return value.comment || '';
};
