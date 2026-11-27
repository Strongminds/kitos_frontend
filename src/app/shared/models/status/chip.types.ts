export const ChipState = {
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
  Neutral: 'neutral',
} as const;

export type ChipState = (typeof ChipState)[keyof typeof ChipState];

export interface ChipContent {
  readonly state: ChipState;
  readonly label: string;
}
