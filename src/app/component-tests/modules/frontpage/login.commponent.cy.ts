import { FrontpageModule } from 'src/app/modules/frontpage/frontpage.module';
import { LoginV2Component } from 'src/app/modules/frontpage/login-v2/login-v2.component';

it('Can see basic elements', () => {
  cy.mount(LoginV2Component, { imports: [FrontpageModule] });
});
