import { FrontpageModule } from 'src/app/modules/frontpage/frontpage.module';
import { PublicMessageComponent } from 'src/app/modules/frontpage/public-message/public-message.component';
import { PublicMessage } from 'src/app/shared/models/public-message.model';

describe('PublicMessageComponent', () => {
  const examplePublicMessage: PublicMessage = {
    uuid: '0000',
    title: 'A title',
    shortDescription: 'This is a short description',
  };

  it('Can see title and short description', () => {
    mountComponent(examplePublicMessage);

    cy.contains(examplePublicMessage.title!);
    cy.contains(examplePublicMessage.shortDescription!);
  });

  it('Has active status chip when active', () => {
    mountComponent({ ...examplePublicMessage, status: true });

    cy.get('app-status-chip').contains('Normal drift');
  });

  it('Has inactive status chip when not active', () => {
    mountComponent({ ...examplePublicMessage, status: false });

    cy.get('app-status-chip').contains('Ustabil drift');
  });

  it('Has no status chip when status is undefined', () => {
    mountComponent(examplePublicMessage);

    cy.get('app-chip').should('not.exist');
  });
});

function mountComponent(publicMessage: PublicMessage) {
  cy.mount(PublicMessageComponent, {
    componentProperties: {
      publicMessage,
    },
    imports: [FrontpageModule],
  });
}
