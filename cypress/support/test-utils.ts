export const runTest = (testTitle: string, setupFn: () => void, testFn: () => void) => {
  cy.log(`**** Setting up test: ${testTitle}****`);
  setupFn();
  cy.log(`**** Running test: ${testTitle}****`);
  testFn();
};
