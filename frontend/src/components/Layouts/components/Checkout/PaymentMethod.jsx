import React from 'react';
import { Card, Radio, Space } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => (
    <Card
        title={<span><CreditCardOutlined className="mr-2" /> Phương thức thanh toán</span>}
        className="w-full mb-6"
    >
        <Radio.Group
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
            className="w-full"
        >
            <Space direction="vertical" className="w-full">
                <Radio value="COD" className="w-full py-2">
                    Thanh toán khi nhận hàng (COD)
                </Radio>
                <Radio value="VNPAY" className="w-full py-2">
                    Thanh toán online qua VNPAY
                </Radio>
            </Space>
        </Radio.Group>
    </Card>
);

export default PaymentMethod;