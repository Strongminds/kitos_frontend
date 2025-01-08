describe('data-processing-notifications', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/v2/organizations?onlyWhereUserHasMembership=true*', {
      fixture: './organizations/organizations.json',
    });

    cy.setupDataProcessingIntercepts();
    cy.setup(true, 'data-processing');

    cy.intercept('/api/v2/data-processing-registrations/fce05ba6-cbb0-4d52-bd33-156f1ef29c72/permissions', {
      fixture: './shared/permissions.json',
    });
    cy.intercept('/api/v2/data-processing-registrations/fce05ba6-cbb0-4d52-bd33-156f1ef29c72', {
      fixture: './dpr/data-processing-registrations.json',
    });

    cy.contains('Dpa 1').click();
  });

  it('Can show empty notification page', () => {
    cy.intercept('/api/v2/data-processing-registrations/fce05ba6-cbb0-4d52-bd33-156f1ef29c72', {
      fixture: './dpr/data-processing-registrations.json',
    });
    cy.intercept('/api/v2/data-processing-registration-role-types*', {
      fixture: './dpr/data-processing-registration-role-types.json',
    });
    cy.intercept('/api/v2/internal/notifications/DataProcessingRegistration*', []);
    cy.navigateToDetailsSubPage('Advis');
  });
});
