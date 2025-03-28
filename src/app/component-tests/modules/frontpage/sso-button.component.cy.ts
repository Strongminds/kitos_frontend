import { FrontpageModule } from 'src/app/modules/frontpage/frontpage.module';
import { SsoButtonComponent } from 'src/app/modules/frontpage/sso-button/sso-button.component';

describe('SsoButtonComponent', () => {
  it('Can see button text and icon', () => {
    cy.mount(SsoButtonComponent, { imports: [FrontpageModule] });
    cy.contains('Log ind med SSO');

    cy.get('app-lock-icon').should('exist');
  });
});
