import { FrontpageModule } from 'src/app/modules/frontpage/frontpage.module';
import { PublicMessageComponent } from 'src/app/modules/frontpage/public-message/public-message.component';
import { PublicMessage } from 'src/app/shared/models/public-message.model';

describe('PublicMessageComponent', () => {
  const examplePublicMessage: PublicMessage = {
    uuid: '0000',
    title: 'A title',
    shortDescription: 'This is a short description',
  };

  it('Can see title and shortdescription', () => {
    cy.mount(PublicMessageComponent, {
      componentProperties: {
        publicMessage: examplePublicMessage,
      },
      imports: [FrontpageModule],
    });

    cy.contains(examplePublicMessage.title as string);
    cy.contains(examplePublicMessage.shortDescription as string);
  });
});
