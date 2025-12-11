import React, { useEffect, useState } from 'react';
import { Badge, Popover, List, Avatar, Button, Typography, Spin } from 'antd';
import { Cart } from '~/assets/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCart,
    selectCartItems,
    selectCartTotalItems,
    selectCartLoading,
    selectCartError,
    resetCart,
} from '~/redux/cartSlice';

const { Text } = Typography;

const CartPopover = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(false);

    // Lấy dữ liệu từ Redux store
    const user = useSelector((state) => state.auth.login.currentUser);
    const cartItems = useSelector(selectCartItems);
    const totalItems = useSelector(selectCartTotalItems);
    const loading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);

    // Kiểm tra kích thước màn hình
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Mobile nếu màn hình <= 768px
        };
        handleResize(); // Gọi khi component mount
        window.addEventListener('resize', handleResize); // Lắng nghe sự kiện resize
        return () => window.removeEventListener('resize', handleResize); // Cleanup
    }, []);

    // Fetch giỏ hàng khi component mount hoặc user thay đổi
    useEffect(() => {
        if (user?.accessToken) {
            dispatch(fetchCart());
        } else {
            dispatch(resetCart());
        }
    }, [user?.accessToken, dispatch]);

    // Xử lý lỗi nếu có
    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const content = user?.accessToken ? (
        <div style={{ width: 300 }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: 12 }}>
                    <Spin />
                </div>
            ) : (
                <>
                    <List
                        itemLayout="horizontal"
                        dataSource={cartItems.slice(0, 5)}
                        locale={{ emptyText: 'Giỏ hàng trống' }}
                        renderItem={(item) => (
                            <div
                                onClick={() => navigate(`/detailed/${item.product._id}`)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    transition: 'background-color 0.2s',
                                    cursor: 'pointer',
                                    marginBottom: 8,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Avatar
                                            src={item.product.imageLink}
                                            shape="square"
                                            size={40}
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <Text
                                            ellipsis
                                            style={{
                                                maxWidth: 160,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {item.product.productName}
                                        </Text>
                                    </div>
                                    <Text strong style={{ color: '#664545' }}>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(item.product.price)}
                                    </Text>
                                </div>
                                <div style={{ textAlign: 'right', marginTop: 4 }}>
                                    <Text type="secondary">Số lượng: {item.quantity}</Text>
                                </div>
                            </div>
                        )}
                    />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 12,
                            borderTop: '1px solid #f0f0f0',
                            paddingTop: 12,
                        }}
                    >
                        <Text strong>
                            {cartItems.length > 5 ? `5/${cartItems.length} sản phẩm` : `${cartItems.length} sản phẩm`}
                        </Text>
                        <Button
                            type="primary"
                            size="small"
                            style={{
                                backgroundColor: '#664545',
                                borderColor: '#664545',
                            }}
                            onClick={() => navigate('/cart')}
                        >
                            Xem giỏ hàng
                        </Button>
                    </div>
                </>
            )}
        </div>
    ) : (
        <div style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ marginBottom: 12 }}>Vui lòng đăng nhập để xem giỏ hàng</div>
            <Button
                type="primary"
                onClick={() => navigate('/auth?mode=signin')}
                style={{
                    backgroundColor: '#664545',
                    borderColor: '#664545',
                }}
            >
                Đăng nhập
            </Button>
        </div>
    );

    return (
        <Popover
            placement={isMobile ? 'bottom' : 'bottomRight'}
            content={content}
            title="Giỏ hàng"
            trigger="hover"
            overlayStyle={
                isMobile
                    ? {
                          maxWidth: '90vw', // Đảm bảo popup không vượt quá chiều rộng màn hình
                          left: '50%', // Căn giữa theo chiều ngang
                          transform: 'translateX(-50%)', // Dịch chuyển để căn giữa
                      }
                    : {}
            }
        >
            <Badge
                count={cartItems.length}
                size="small"
                offset={[6, 0]}
                overflowCount={10}
                style={{
                    backgroundColor: '#ff0000',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 0 0 1px #fff', // Viền trắng để nổi bật
                }}
            >
                <Cart
                    className="navbar-icon"
                    style={{
                        fontSize: 20,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        ':hover': {
                            transform: 'scale(1.1)',
                        },
                    }}
                />
            </Badge>
        </Popover>
    );
};

export default CartPopover;