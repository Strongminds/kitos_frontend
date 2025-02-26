import { PublicMessageComponent } from 'src/app/modules/frontpage/public-message/public-message.component';

describe('PublicMessageComponent', () => {
  it('Can mount', () => {
    cy.mount(PublicMessageComponent);
  });
});
