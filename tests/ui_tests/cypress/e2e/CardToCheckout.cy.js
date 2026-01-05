describe("Test to Card", () => {
    beforeEach(() => {
        cy.login();
        cy.wait(3000);
        cy.addtocart();
      });
    
    it("Click vào xem giỏ hàng để xem sản phẩm đã thêm", () => {
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
});