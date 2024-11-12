import { createEntityAdapter } from "@ngrx/entity";
import { APIHelpTextResponseDTO } from "src/app/api/v2/model/helpTextResponseDTO";
import { HelpTextsState } from "./state";
import { createFeature, createReducer, on } from "@ngrx/store";
import { HelpTextActions } from "./actions";

export const helpTextAdapter = createEntityAdapter<APIHelpTextResponseDTO>();

export const helpTextsInitialState: HelpTextsState = helpTextAdapter.getInitialState({
  helpTexts: []
});

export const helpTextFeature = createFeature({
  name: 'HelpText',
  reducer: createReducer(
    helpTextsInitialState,
    on(HelpTextActions.getHelpTextsSuccess, (state, { helpTexts }): HelpTextsState => ({
      ...state,
      helpTexts
    })),
    on(HelpTextActions.createHelpTextSuccess, (state, { helpText }): HelpTextsState => ({
      ...state,
      helpTexts: [...state.helpTexts, helpText]
    })),
    on(HelpTextActions.updateHelpTextSuccess, (state, { helpText }): HelpTextsState => ({
      ...state,
      helpTexts: [...state.helpTexts, helpText]
    }))
  )
});
