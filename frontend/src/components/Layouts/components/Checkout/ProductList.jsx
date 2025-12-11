import React from 'react';
import { ShoppingOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const ProductList = ({ selectedItems }) => (
    <Card
        title={<span><ShoppingOutlined className="mr-2" /> Thông tin đơn hàng</span>}
        className="w-full mb-6"
    >
        <div className="divide-y">
            {selectedItems.map((item, index) => (
                <div key={index} className="py-4 flex justify-between">
                    <div className="flex items-start gap-4">
                        <img
                            src={item.product.imageLink}
                            alt={item.product.productName}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                            <p className="text-lg font-medium">{item.product.productName}</p>
                            <p className="text-gray-500">Đơn giá:&ensp;
                                <span className="text-[#664545] font-semibold">
                                    {item.product.price.toLocaleString('vi-VN')}₫
                                </span>
                            </p>
                            <p className="text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p>Tổng tiền ({item.quantity} sản phẩm)</p>
                        <p className="text-lg font-semibold text-[#664545]">
                            {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

export default ProductList;