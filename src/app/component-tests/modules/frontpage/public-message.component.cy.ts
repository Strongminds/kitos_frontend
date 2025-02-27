import { PublicMessageComponent } from 'src/app/modules/frontpage/public-message/public-message.component';
import { PublicMessage } from 'src/app/shared/models/public-message.model';
import { of } from 'rxjs';
import { FrontpageComponentStore } from 'src/app/modules/frontpage/frontpage.component-store';
import { mapStatusType } from 'src/app/shared/models/status-type.model';
import { APIPublicMessageRequestDTO } from 'src/app/api/v2';
import { FrontpageModule } from 'src/app/modules/frontpage/frontpage.module';

describe('PublicMessageComponent', () => {
  const examplePublicMessage: PublicMessage = {
    uuid: '0000',
    title: 'A title',
    shortDescription: 'This is a short description',
  };

  it('Can see title, short description and icon', () => {
    mountComponent(examplePublicMessage);

    cy.contains(examplePublicMessage.title as string);
    cy.contains(examplePublicMessage.shortDescription as string);
    cy.get('app-document-icon').should('exist');
  });

  it('Has active status chip when active', () => {
    mountComponent({ ...examplePublicMessage, status: mapStatusType(APIPublicMessageRequestDTO.StatusEnum.Active) });
    cy.get('app-status-chip').contains('Normal drift');
  });

  it('Has inactive status chip when not active', () => {
    mountComponent({ ...examplePublicMessage, status: mapStatusType(APIPublicMessageRequestDTO.StatusEnum.Inactive) });
    cy.get('app-status-chip').contains('Ustabil drift');
  });

  it('Has no status chip when status is undefined', () => {
    mountComponent({ ...examplePublicMessage, status: undefined });
    cy.get('app-status-chip').should('not.exist');
  });
});

function mountComponent(publicMessage: PublicMessage) {
  cy.mount(PublicMessageComponent, {
    componentProperties: {
      config: {
        iconType: 'document',
        index: 0,
      },
      mode: 'normal',
    },
    providers: [
      {
        provide: FrontpageComponentStore,
        useValue: { publicMessages$: of([publicMessage]) },
      },
    ],

    imports: [FrontpageModule],
  });
}
