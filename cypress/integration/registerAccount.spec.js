/* eslint-disable jest/expect-expect */
describe('register form in homepage', () => {
  it('should add new user successfully', () => {
    // arrange
    cy.server();
    cy.route('POST', `${Cypress.env('apiUrl')}/api/v1/accounts/*`).as(
      'register',
    );
    cy.visit('/');

    cy.get('b[role=button]').click();

    const email = `foo@${Math.random()}.com`;
    cy.get('input#register-Firstname').type('john');
    cy.get('input#register-Lastname').type('doe');
    cy.get('input#register-Email').type(email);
    cy.get('input#register-Password').type('teslaa');
    cy.get('input#register-ConfirmPassword').type('teslaa');

    // act
    cy.get('button[type=submit].register__btn').click();
    cy.wait('@register');

    // assert
    const successTitle =
      'Registration successful. Please check your email for verification.';
    cy.get('div.MuiAlert-action').should('be.visible');
    cy.get('div.MuiAlert-message').should('be.visible').contains(successTitle);
  });
});
