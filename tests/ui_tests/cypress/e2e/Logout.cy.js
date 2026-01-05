
describe("Test Logout", () => {
    beforeEach(() => {
        cy.login();
    });
  
    it('Logout', () => {
      cy.get('img[alt="User account"]').click();
  
      cy.contains('li', 'Đăng xuất').click();
      cy.wait(6000);
      cy.contains('button', 'Đồng ý').click();

      cy.wait(1000);
      cy.url().should('include', '/auth');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  });
  