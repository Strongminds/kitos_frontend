/// <reference types="cypress" />

describe('Reset password', () => {
  beforeEach(() => {
    cy.requireIntercept();
  });

  it('Can send request for password reset', () => {});

  it('Can reset password if requestId is valid', () => {});

  it('Can not reset password if requestId is invalid', () => {});
});
