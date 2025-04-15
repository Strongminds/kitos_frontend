import { of } from 'rxjs';
import { APIPublicMessageRequestDTO } from 'src/app/api/v2';
import { FrontpageComponentStore } from 'src/app/modules/frontpage/frontpage.component-store';
import { FrontpageModule } from 'src/app/modules/frontpage/frontpage.module';
import { PublicMessageComponent } from 'src/app/modules/frontpage/public-message/public-message.component';
import { PublicMessage } from 'src/app/shared/models/public-messages/public-message.model';
import { mapStatusType } from 'src/app/shared/models/public-messages/status-type.model';

describe('PublicMessageComponent', () => {
  const examplePublicMessage: PublicMessage = {
    uuid: '0000',
    title: 'A title',
    shortDescription: 'This is a short description',
    iconType: { icon: 'clipboard', name: '', value: APIPublicMessageRequestDTO.IconTypeEnum.Clipboard },
  };

  it('Can see title, short description and icon', () => {
    mountComponent(examplePublicMessage);

    cy.contains(examplePublicMessage.title as string);
    cy.contains(examplePublicMessage.shortDescription as string);
    cy.get('app-clipboard-icon').should('exist');
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
    cy.get('app-status-chip').should('not.be.visible');
  });
});

function mountComponent(publicMessage: PublicMessage) {
  cy.mount(PublicMessageComponent, {
    componentProperties: {
      mode: 'normal',
      publicMessageUuid: publicMessage.uuid,
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
