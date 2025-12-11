describe('Test Login', () => {
  it('Login', () => {
    cy.visit('http://localhost:5173/auth?mode=signin');
    cy.wait(3000);
    cy.get('input[name="email"]').type('giaman123@gmail.com');
    cy.wait(3000);
    cy.get('input[name="password"]').type('Giahue15');
    cy.wait(3000);
    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/auth?mode=signin');

  });
});