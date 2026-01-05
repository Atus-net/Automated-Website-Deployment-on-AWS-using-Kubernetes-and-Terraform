describe("Test Checkout", () => {
    beforeEach(() => {
      cy.login();
      cy.wait(3000);
      cy.addtocart();
      cy.cardtocheckout(); 
    });
  
    it("Chọn hoặc thêm địa chỉ mới, chọn thanh toán VNPAY và đặt hàng", () => {
      cy.url().should('include', '/checkout');
  
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Thay đổi")').length) {
          cy.contains('Thay đổi').click();
          cy.contains('Thêm địa chỉ mới').click();
        } else {
          cy.contains('Thêm địa chỉ mới').click();
        }
      });
  
    cy.contains('label', 'Họ và tên')
    .closest('.ant-form-item')
    .find('input')
    .clear()
    .wait(1000)
    .type('Nguyễn Văn A');

    cy.contains('label', 'Số điện thoại')
    .closest('.ant-form-item')
    .find('input')
    .clear()
    .wait(1000)
    .type('0912345678');
    cy.wait(1000);

      cy.get('.ant-select').eq(0).click();
      cy.get('.ant-select-dropdown .ant-select-item-option').first().click();
      cy.wait(1000);

      cy.get('.ant-select').eq(1).click();
      cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .find('.ant-select-item-option')
        .first()
        .click();

        cy.get('.ant-select').eq(2).click();
        cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .find('.ant-select-item-option')
        .first()
        .click(); 

        cy.contains('label', 'Số nhà, tên đường')
        .closest('.ant-form-item')
        .find('textarea')
        .clear()
        .type('Số 123, tòa E3');
      cy.get('.ant-checkbox').click({ force: true });
  
      cy.contains('button', 'Lưu địa chỉ').click();
      cy.contains('Thay đổi', { timeout: 5000 }).should('exist');
      cy.wait(1000);

      cy.get('input[type="radio"][value="VNPAY"]').check({ force: true });
      cy.wait(3000);


    cy.contains('button','Đặt hàng').click();

    
    });
  });
  