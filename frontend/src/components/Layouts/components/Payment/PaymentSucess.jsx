import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Button, message } from 'antd';

const PaymentSuccess = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  // const query = new URLSearchParams(location.search);
  // const token = query.get('token');

  // useEffect(() => {
  //   const authData = JSON.parse(localStorage.getItem('paymentAuth'));

  //   // Kiểm tra token hợp lệ
  //   const isValid = (
  //     authData &&
  //     authData.token === token &&
  //     authData.expires > Date.now()
  //   );

  //   if (!isValid) {
  //     navigate('/', { replace: true });
  //     message.error('Token không hợp lệ hoặc đã hết hạn!');
  //   } else {
  //     // Xóa token sau khi xác thực
  //     localStorage.removeItem('paymentAuth');
  //   }
  // }, [token, navigate]);

  return (
    <div className="payment-success-page my-16 ml-12 flex flex-col items-center justify-center text-center">
      {/* Nội dung trang thành công */}
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle="Đơn hàng của bạn đã được xử lý thành công"
        extra={[
          <Button key="home" type="primary" onClick={() => navigate('/')}>
            Quay lại trang chủ{' '}
          </Button>,
          <Button key="orders" onClick={() => navigate('/account/orders')}>
            Xem đơn hàng của tôi
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentSuccess;
