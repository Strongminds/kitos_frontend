import { APIHelpTextResponseDTO } from 'src/app/api/v2/model/helpTextResponseDTO';

export interface HelpText {
  Description: string | undefined;
  Key: string;
  Title: string | undefined;
}

export const defaultHelpText: HelpText = {
  Description: $localize`<p>Ingen hjælpetekst defineret.</p>`,
  Key: '',
  Title: $localize`Ingen hjælpetekst`,
};

export function adaptHelpText(apiHelpText: APIHelpTextResponseDTO): HelpText | undefined {
  if (!apiHelpText.key) return undefined;

  return {
    Description: apiHelpText.description,
    Key: apiHelpText.key,
    Title: apiHelpText.title,
  };
}

export function adaptHelpTextOrThrow(dto: APIHelpTextResponseDTO): HelpText {
  const helpText = adaptHelpText(dto);
  if (!helpText){
    throw new Error('Could not adapt help text');
  }
  return helpText;
}
