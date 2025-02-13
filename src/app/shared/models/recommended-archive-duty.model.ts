import { APIRecommendedArchiveDutyResponseDTO } from 'src/app/api/v2';

export const mapRecommendedArchiveDutyToString = (value: APIRecommendedArchiveDutyResponseDTO): string | undefined => {
  switch (value.id) {
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.Undecided:
      return undefined;
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.NoRecommendation:
      return $localize`Ingen vejledning`;
    default:
      return value.id; //tager værdi direkte fra dto, skal gennem mapping i archive-duty-recommendation-choice
        //for det er forkert at denne ikke får den nye længere enumtekst med
        //dog overvej "ved ikke" vs "ingen vejledning?" Men det skal frontend vel ikke bestemme

  }
};

export const mapRecommendedArchiveDutyComment = (value: APIRecommendedArchiveDutyResponseDTO): string => {
  if (!value.id || value.id === APIRecommendedArchiveDutyResponseDTO.IdEnum.Undecided) return '';
  return value.comment || '';
};
