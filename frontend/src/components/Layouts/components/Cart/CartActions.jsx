import React from 'react';
import { Button, Typography } from 'antd';

const { Text } = Typography;

const CartActions = ({
    hasSelected,
    onCheckout,
    selectedCount,
    totalAmount,
    loading,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Bỏ trống nếu không cần gì bên trái */}
            <div className="sm:flex-row sm:items-center sm:gap-4" />

            {/* Phần hiển thị Tổng cộng + Button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-center sm:text-left">
                    <Text className="text-sm sm:text-base">
                        Tổng cộng ({selectedCount} sản phẩm):
                    </Text>
                    <Text
                        className="text-lg sm:text-xl font-bold"
                        style={{ color: '#664545' }}
                    >
                        {totalAmount}
                    </Text>
                </div>
                <Button
                    type="primary"
                    style={{
                        backgroundColor: hasSelected ? '#664545' : undefined,
                        borderColor: hasSelected ? '#664545' : undefined,
                    }}
                    onClick={onCheckout}
                    size="large"
                    disabled={!hasSelected}
                    loading={loading}
                    className="w-full sm:w-auto"
                >
                    Mua hàng
                </Button>
            </div>
        </div>
    );
};

export default CartActions;
