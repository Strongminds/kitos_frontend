/// <reference types="cypress" />

import { of } from 'rxjs';
import { LinkTextboxComponent } from './link-textbox.component';
import { AppModule } from 'src/app/app.module';

it('Emits open event clicking empty link textbox', () => {
  const onClickSpy = cy.spy().as('onClick');
  cy.mount(LinkTextboxComponent, {
    componentProperties: {
      title: 'Title',
      simpleLink$: of({ url: undefined, name: undefined }),
      iconClick: { emit: onClickSpy } as any,
    },
    imports: [AppModule],
  });

  cy.contains('Title').click();
  cy.get('@onClick').should('have.been.called');
});
