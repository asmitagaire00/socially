/* eslint-disable jest/expect-expect */
describe('load homepage', () => {
  it('should render correctly', () => {
    // arrange
    cy.visit('/');
    // act
    // asssert
    cy.get('div#root').should('be.visible');
  });
});
