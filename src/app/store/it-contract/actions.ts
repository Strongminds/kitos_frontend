import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIItContractResponseDTO, APIUpdateContractRequestDTO } from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITContract } from 'src/app/shared/models/it-contract/it-contract.model';

export const ITContractActions = createActionGroup({
  source: 'ITContract',
  events: {
    'Get IT Contract': (contractUuid: string) => ({ contractUuid }),
    'Get IT Contract Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Get IT Contract Error': emptyProps(),
    'Get IT Contracts': (odataString: string) => ({ odataString }),
    'Get IT Contracts Success': (itContracts: ITContract[], total: number) => ({ itContracts, total }),
    'Get IT Contracts Error': emptyProps(),
    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Delete IT Contract': emptyProps(),
    'Delete IT Contract Success': emptyProps(),
    'Delete IT Contract Error': emptyProps(),
    'Patch IT Contract': (
      itContract: APIUpdateContractRequestDTO,
      customSuccessText?: string,
      customErrorText?: string
    ) => ({ itContract, customSuccessText, customErrorText }),
    'Patch IT Contract Success': (itContract: APIItContractResponseDTO, customSuccessText?: string) => ({
      itContract,
      customSuccessText,
    }),
    'Patch IT Contract Error': (customErrorText?: string) => ({ customErrorText }),
  },
});
