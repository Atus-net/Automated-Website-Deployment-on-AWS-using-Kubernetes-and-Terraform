import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, message, Result } from 'antd';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //xem tiếp sản phẩm
  useEffect(() => {
    // Kiểm tra token từ state và localStorage
    const { orderToken } = location.state || {};
    const storedToken = JSON.parse(localStorage.getItem('orderToken'));

    const isValid = (
      orderToken &&
      storedToken &&
      storedToken.token === orderToken &&
      storedToken.expires > Date.now()
    );

    if (!isValid) {
      navigate('/'); // Chuyển hướng nếu không hợp lệ
      message.error('Đơn hàng không hợp lệ hoặc đã hết hạn!');
      return;
    }

    // Xóa token sau khi xác thực thành công
    localStorage.removeItem('orderToken');
  }, [location]);

  const handleBackHome = () => {
    navigate('/category');
  };

  const handleViewOrders = () => {
    navigate('/account/orders');
  };

  return (
    <div className="my-16 ml-12 flex flex-col items-center justify-center text-center">
      <Result
        status="success"
        title="Đặt hàng thành công!"
        subTitle="Cảm ơn bạn đã đặt hàng, Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể."
        extra={[
          <Button type="primary" key="backHome" onClick={handleBackHome}>
            Xem thêm sản phẩm
          </Button>,
          <Button key="viewOrders" onClick={handleViewOrders}>
            Xem đơn hàng của tôi
          </Button>,
        ]}
      />
    </div>
  );
};

export default OrderSuccess;