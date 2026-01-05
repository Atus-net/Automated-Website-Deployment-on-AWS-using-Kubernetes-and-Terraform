import React from 'react';
import { Table, Image, Typography, InputNumber, Popconfirm, Button, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const CartTable = ({ dataSource, rowSelection, onQuantityChange, onRemoveItem }) => {
    const navigate = useNavigate();
    const renderEmptyCart = () => (
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <span style={{ fontSize: '16px' }}>Bạn chưa có sản phẩm nào trong giỏ hàng</span>
            }
        >
            <Button
                type="primary"
                onClick={() => navigate('/category?page=1')} // Điều hướng đến trang sản phẩm
                style={{ marginTop: '20px' }}
            >
                Xem sản phẩm
            </Button>
        </Empty>
    );
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            width: 250, // Tăng độ rộng cột "Sản phẩm"
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image src={text.image} width={50} height={50} alt={text.name} />
                    <Text
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/detailed/${record.key}`)}
                    >
                        {text.name}
                    </Text>
                </div>
            ),
            responsive: ['xs', 'sm', 'md', 'lg'], // Hiển thị trên mọi kích thước
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            width: 100, // Giữ độ rộng vừa phải cho cột "Đơn giá"
            responsive: ['xs', 'sm', 'md', 'lg'], // Ẩn trên màn hình rất nhỏ
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: 80, // Giữ độ rộng vừa phải cho cột "Số lượng"
            render: (quantity, record) => (
                <InputNumber
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(value) => onQuantityChange(record.key, value)}
                    className="w-full"
                />
            ),
            responsive: ['xs', 'sm', 'md', 'lg'], // Hiển thị trên mọi kích thước
        },
        {
            title: 'Số tiền',
            dataIndex: 'total',
            width: 120, // Tăng độ rộng cột "Số tiền"
            render: (text) => (
                <Text style={{ color: '#664545', fontWeight: 'bold', fontSize: 16 }}>
                    {text}
                </Text>
            ),
            responsive: ['xs', 'sm', 'md', 'lg'], // Hiển thị trên mọi kích thước
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            width: 10, 
            render: (_, record) => (
                <Popconfirm
                    title="Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"
                    onConfirm={() => onRemoveItem(record.key)}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Button type="text">Xóa</Button>
                </Popconfirm>
            ),
            responsive: ['xs', 'sm', 'md', 'lg'], // Hiển thị trên mọi kích thước
        },
    ];
    
    return (
        <div style={{ overflowX: 'auto' }}>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                locale={{
                    emptyText: renderEmptyCart(), // Sử dụng custom empty component
                }}
                scroll={{ x: 800 }} // Cho phép cuộn ngang nếu bảng quá rộng
            />
        </div>
    );
};

export default CartTable;
