Cypress.Commands.add('login', (email = 'giaman123@gmail.com', password = 'Giahue15') => {
    cy.visit('http://localhost:5173/auth?mode=signin');
  
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  
    cy.url().should('not.include', '/auth?mode=signin');
  });

Cypress.Commands.add('addtocart', () => {
 
  cy.contains('li', 'Bánh Sinh Nhật').click({ force: true });
  
  cy.url().should('include', '/category?mode=birthday');

  cy.get('.ant-card').should('have.length.greaterThan', 0);

  cy.get('.ant-card')
    .first()
    .contains('Thêm vào giỏ')
    .click();

  cy.get('.ant-message').contains('Đã thêm vào giỏ hàng').should('be.visible');
});

Cypress.Commands.add('cardtocheckout', () => {
  cy.get('.navbar-icon').trigger('mouseover');
  cy.wait(1000);
  cy.contains('Xem giỏ hàng', { timeout: 3000 }).should('be.visible').click();

  cy.url().should('include', '/cart');

  cy.get('tbody .ant-table-row', { timeout: 5000 }).should('have.length.greaterThan', 0);

  cy.get('thead .ant-checkbox-wrapper').click({ force: true });

  cy.get('.ant-table-row-selected', { timeout: 3000 }).should('have.length.greaterThan', 0);

  cy.wait(1000);

  cy.contains('Mua hàng', { timeout: 3000 }).should('be.visible').click();

  cy.url().should('include', '/checkout');
});