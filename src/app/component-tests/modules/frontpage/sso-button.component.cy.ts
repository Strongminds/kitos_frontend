import { FrontpageModule } from 'src/app/modules/frontpage/frontpage.module';
import { SsoButtonComponent } from 'src/app/modules/frontpage/sso-button/sso-button.component';

describe('SsoButtonComponent', () => {
  it('Can see button text and icon', () => {
    cy.mount(SsoButtonComponent, { imports: [FrontpageModule] });
    cy.contains('Log ind med SSO');

    cy.get('app-lock-icon').should('exist');
  });

  it('Can click and emit event', () => {
    const clickSpy = cy.spy().as('buttonClick');
    cy.mount(SsoButtonComponent, {
      imports: [FrontpageModule],
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      componentProperties: { buttonClick: { emit: clickSpy } } as any,
    });

    cy.get('button').click({ force: true });
    cy.get('@buttonClick').should('have.been.calledOnce');
  });
});
