import { EntityState } from "@ngrx/entity";
import { HelpText } from "src/app/shared/models/help-text.model";

export interface HelpTextsState extends EntityState<HelpText>
{
  helpTexts: HelpText[];
}
