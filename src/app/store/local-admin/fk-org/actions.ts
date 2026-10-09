import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIConnectionUpdateConsequencesResponseDTO,
  APIConnectToStsOrganizationRequestDTO,
  APIStsOrganizationChangeLogResponseDTO,
  APIStsOrganizationOrgUnitDTO,
  APIStsOrganizationSynchronizationDetailsResponseDTO,
  APIStsOrganizationUserSynchronizationDetailsResponseDTO,
} from 'src/app/api/v2';

export const FkOrgActions = createActionGroup({
  source: 'FkOrg',
  events: {
    'Get Synchronization Status': emptyProps(),
    'Get Synchronization Status Success ': (
      synchronizationStatus: APIStsOrganizationSynchronizationDetailsResponseDTO,
    ) => ({ synchronizationStatus }),
    'Get Synchronization Status Error': emptyProps(),

    'Get Snapshot': emptyProps(),
    'Get Snapshot Success': (snapshot: APIStsOrganizationOrgUnitDTO) => ({ snapshot }),
    'Get Snapshot Error': emptyProps(),

    'Create Connection': (request: APIConnectToStsOrganizationRequestDTO) => ({ request }),
    'Create Connection Success': emptyProps(),
    'Create Connection Error': emptyProps(),

    'Preview Connection Update': (synchronizationDepth: number | undefined) => ({ synchronizationDepth }),
    'Preview Connection Update Success': (response: APIConnectionUpdateConsequencesResponseDTO) => ({
      response,
    }),
    'Preview Connection Update Error': emptyProps(),
    'Cancel Update': emptyProps(),

    'Update Connection': (request: APIConnectToStsOrganizationRequestDTO) => ({ request }),
    'Update Connection Success': emptyProps(),
    'Update Connection Error': emptyProps(),

    'Delete Automatic Update Subscription': emptyProps(),
    'Delete Automatic Update Subscription Success': emptyProps(),
    'Delete Automatic Update Subscription Error': emptyProps(),

    'Delete Connection': (purgeUnusedExternalUnits: boolean) => ({ purgeUnusedExternalUnits }),
    'Delete Connection Success': emptyProps(),
    'Delete Connection Error': emptyProps(),

    'Get Changelog': (numberOfChangeLogs: number) => ({ numberOfChangeLogs }),
    'Get Changelog Success': (changelogs: APIStsOrganizationChangeLogResponseDTO[]) => ({ changelogs }),
    'Get Changelog Error': emptyProps(),

    'Get User Synchronization Status': emptyProps(),
    'Get User Synchronization Status Success': (
      userSynchronizationStatus: APIStsOrganizationUserSynchronizationDetailsResponseDTO,
    ) => ({ userSynchronizationStatus }),
    'Get User Synchronization Status Error': emptyProps(),

    'Create User Connection': emptyProps(),
    'Create User Connection Success': emptyProps(),
    'Create User Connection Error': emptyProps(),

    'Delete User Connection': emptyProps(),
    'Delete User Connection Success': emptyProps(),
    'Delete User Connection Error': emptyProps(),
  },
});
