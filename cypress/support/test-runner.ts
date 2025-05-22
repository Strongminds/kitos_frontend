export class TestRunner {
  private setupFn: () => void;
  constructor(setupFunction: () => void) {
    this.setupFn = setupFunction;
  }

  public runTestWithSetup(testTitle: string, testFn: () => void) {
    this.runTest(testTitle, this.setupFn, testFn);
  }

  public runTest = (testTitle: string, setupFn: () => void, testFn: () => void) => {
    cy.log(`**** Setting up test: ${testTitle}****`);
    setupFn();
    cy.log(`**** Running test: ${testTitle}****`);
    testFn();
  };
}
