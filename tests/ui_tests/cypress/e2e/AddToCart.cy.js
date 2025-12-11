describe("Test add to cart", () => {
    beforeEach(() => {
      cy.login();
      cy.wait(3000);
    });
  
    it("Click vào 'Bánh Sinh Nhật' trong menu và thêm sản phẩm vào giỏ", () => {
 
      cy.contains('li', 'Bánh Sinh Nhật').click({ force: true });
  
      cy.url().should('include', '/category?mode=birthday');
  
      cy.get('.ant-card').should('have.length.greaterThan', 0);
  
      cy.get('.ant-card')
        .first()
        .contains('Thêm vào giỏ')
        .click();
  
      cy.get('.ant-message').contains('Đã thêm vào giỏ hàng').should('be.visible');
    });
  });
  