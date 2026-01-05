import React from 'react';
import { Button, Result, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <div className="my-16 ml-12 flex flex-col items-center justify-center text-center">
      <Result
        status="error"
        title="Thanh toán không thành công"
        subTitle="Hãy hoàn tất thanh toán trong vòng 24h để đơn hàng được xử lý."
        extra={
          <Space>
            <Button type="primary" onClick={() => navigate('/')}>
              Quay lại trang chủ
            </Button>
            <Button onClick={() => navigate('/account/orders')}> Xem đơn hàng của tôi</Button>
          </Space>
        }
      />
    </div>
  );
};

export default PaymentFail;
