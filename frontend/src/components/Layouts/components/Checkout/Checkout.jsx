import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllAddress, createAddress, updateAddress } from '~/api/apiUser';
import { createOrder } from '~/api/apiOrder';
import { loginSuccess } from '~/redux/authSlice';
import { createInstance } from '~/redux/interceptors';
import { Form, message } from 'antd';

// Import các component đã tách
import AddressSection from './AddressSection';
import ProductList from './ProductList';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import AddressListModal from './AddressListModal';
import NewAddressModal from './NewAddressModal';

const Checkout = () => {
    // Các state và hooks giữ nguyên
    const { state } = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login.currentUser);
    const instance = createInstance(user, dispatch, loginSuccess);
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const userData = currentUser?.user || currentUser?.data || currentUser;

    // Các state giữ nguyên
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [openAddressList, setOpenAddressList] = useState(false);
    const [openNewAddressModal, setOpenNewAddressModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {
        selectedItems = [],
        totalAmount = 0
    } = state || {};
    const displayItems = state?.selectedItems?.length > 0
        ? state.selectedItems
        : [];
    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);

    // Các useEffect và hàm xử lý giữ nguyên

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const stateId = params.get('state');

        if (!stateId) {
            message.error('Thiếu thông tin đơn hàng');
            navigate('/cart');
            return;
        }

        // Lấy data từ localStorage
        const savedData = JSON.parse(localStorage.getItem(`checkoutState_${stateId}`));

        if (!savedData) {
            message.warning(
                'Một số sản phẩm trong giỏ hàng vừa được cập nhật, bạn vui lòng kiểm tra và thử lại.'
            );
            navigate('/cart');
            return;
        }

    }, [location]);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await getAllAddress();
                setAddresses(res || []);
                const defaultAddress = res?.find((addr) => addr.isDefault);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress._id);
                }
            } catch (err) {
                console.error(err);
                message.error('Lỗi khi tải danh sách địa chỉ');
            }
        };

        fetchAddresses();
    }, []);

    const handleOrder = async () => {
        if (!selectedAddressId) {
            message.error('Vui lòng chọn địa chỉ giao hàng');
            return;
        }

        if (!state?.selectedItems?.length) {
            message.error('Không có sản phẩm nào để thanh toán');
            return;
        }

        try {
            setLoading(true);
            const orderData = {
                cartItemIds: selectedItems.map(item => item._id),
                addressId: selectedAddressId,
                paymentMethod: paymentMethod
            };

            console.table('Dữ liệu đơn hàng:', orderData); // Kiểm tra trước khi gửi

            // Gọi API tạo đơn hàng
            const response = await createOrder(instance, orderData);
            const paymentURL = response.paymentUrl || null;
            const params = new URLSearchParams(location.search);
            localStorage.removeItem(`checkoutState_${params.get('state')}`);

            if (paymentMethod === 'VNPAY' && paymentURL) {
                // Chuyển hướng đến VNPAY với orderId
                window.location.href = paymentURL;
            }
            if (paymentMethod === 'COD') {
                // Tạo orderToken ngẫu nhiên
                const orderToken = Math.random().toString(36).substring(2, 15);

                localStorage.setItem('orderToken', JSON.stringify({
                    token: orderToken,
                    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
                }));

                navigate('/order-success', {
                    state: {
                        orderId: response._id,
                        address: selectedAddress,
                        orderToken // Truyền token qua state
                    }
                });
            }
        } catch (error) {
            message.error('Đặt hàng thất bại: ' + error.message);
            console.error('Lỗi khi tạo đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSubmit = async (values) => {
        setLoading(true);
        try {
            if (values.isDefault) {
                const updates = addresses
                    .filter((addr) => addr.isDefault)
                    .map((addr) => updateAddress(addr._id, { ...addr, isDefault: false }));

                await Promise.all(updates);
            }

            const newAddress = await createAddress(values);

            if (newAddress) {
                const updatedAddresses = await getAllAddress();
                setAddresses(updatedAddresses || []);
                setSelectedAddressId(newAddress._id);
                message.success('Thêm địa chỉ thành công');
                setOpenNewAddressModal(false);
                form.resetFields();
            } else {
                alert('Không thể tạo địa chỉ mới');
            }
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi lưu địa chỉ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-16 px-8 py-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

            {displayItems.length === 0 ? (
                <Card className="text-center">
                    <p className="text-lg">Chưa chọn sản phẩm nào để mua.</p>
                    <Button type="primary" href="/cart" className="mt-4">
                        Xem giỏ hàng
                    </Button>
                </Card>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <AddressSection
                            selectedAddress={selectedAddress}
                            addresses={addresses}
                            setOpenAddressList={setOpenAddressList}
                            setOpenNewAddressModal={setOpenNewAddressModal}
                        />

                        <ProductList selectedItems={selectedItems} />

                        <PaymentMethod
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />

                        <OrderSummary
                            totalAmount={totalAmount}
                            handleOrder={handleOrder}
                            loading={loading}
                        />
                    </div>
                </div>
            )}

            <AddressListModal
                open={openAddressList}
                onClose={() => setOpenAddressList(false)}
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                setOpenNewAddressModal={setOpenNewAddressModal}
            />

            <NewAddressModal
                open={openNewAddressModal}
                onClose={() => {
                    setOpenNewAddressModal(false);
                    form.resetFields();
                }}
                form={form}
                userData={userData}
                loading={loading}
                handleAddressSubmit={handleAddressSubmit}
            />
        </div>
    );
};

export default Checkout;