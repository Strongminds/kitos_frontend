import { CheckboxComponent } from './checkbox.component';
import { SharedModule } from '../../shared.module';

it('Can mount', () => {
  const onChangeSpy = cy.spy().as('onChange');
  const buttonText = 'Checkbox text';
  cy.mount(CheckboxComponent, {
    componentProperties: {
      text: buttonText, //@Input() text: string;
      valueChange: { emit: onChangeSpy } as any, //@Output() valueChange: EventEmitter<boolean> = new EventEmitter();
    },
    imports: [SharedModule],
  });
  cy.getByDataCy('checkbox-input').click();
  cy.get('@onChange').should('have.been.calledWith', true);
  cy.getByDataCy('checkbox-input').click();
  cy.get('@onChange').should('have.been.calledWith', false);

  cy.contains(buttonText);
});
