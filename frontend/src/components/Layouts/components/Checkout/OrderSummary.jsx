import React from 'react';
import { Card, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const OrderSummary = ({ totalAmount, handleOrder, loading }) => (
    <Card>
        <div className="flex justify-between text-lg font-semibold text-[20px] mb-6">
            <span>Tổng tiền hàng</span>
            {totalAmount.toLocaleString('vi-VN')}₫
        </div>
        <div className="flex justify-between text-lg font-semibold text-[20px] mb-6">
            <span>Tổng tiền phí vận chuyển</span>
            0₫
        </div>
        <div className="flex justify-between text-lg font-semibold">
            <span>Tổng thanh toán:</span>
            <span className="text-[30px] font-bold text-[#664545]">
                {totalAmount.toLocaleString('vi-VN')}₫
            </span>
        </div>
        <Divider />
        <div className='flex flex-col sm:flex-row justify-between items-center mt-4 mb-6 gap-3'>
            <div className="flex flex-wrap items-center justify-center sm:justify-start text-sm text-gray-600 text-center sm:text-left">
                Khi nhấn 'Đặt hàng', bạn xác nhận rằng bạn đồng ý với
                <Link
                    to="/condition?mode=condition"
                    className="text-[#664545] font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                    Điều khoản Dolciluxe
                </Link>
            </div>
            <Button
                type="primary"
                size="large"
                onClick={handleOrder}
                loading={loading}
                className="h-12 w-full sm:w-[200px] text-lg font-medium hover:bg-[#ee4d2d]/90 border-none"
            >
                Đặt hàng
            </Button>
        </div>
    </Card>
);

export default OrderSummary;