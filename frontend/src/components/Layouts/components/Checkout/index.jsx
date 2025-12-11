import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAddress, createAddress, updateAddress } from '~/api/apiUser';
import AddressSelector from '../Account/contents/AddressSelector';
import { Card, Radio, Button, Modal, Form, Input, Checkbox, Divider, Space, Tag, message } from 'antd';
import {
  EnvironmentOutlined,
  EditOutlined,
  PlusOutlined,
  CreditCardOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotalItems, selectCartTotalPrice } from '~/redux/cartSlice';
import { createOrder } from '~/api/apiOrder';
import { loginSuccess } from '~/redux/authSlice';
import { createInstance } from '~/redux/interceptors';

const Checkout1 = () => {
  const cartItems = useSelector(selectCartItems);
  const { state } = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const instance = createInstance(user, dispatch, loginSuccess);
  const {
    // cartItems = [],
    selectedItems = [],
    totalAmount = 0
  } = state || {};
  const displayItems = state?.selectedItems?.length > 0
    ? state.selectedItems
    : [];
  // const totalAmount = useSelector(selectCartTotalPrice);
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const userData = currentUser?.user || currentUser?.data || currentUser;

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [openAddressList, setOpenAddressList] = useState(false);
  const [openNewAddressModal, setOpenNewAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();


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



      // console.log('Đơn hàng đã được tạo:', response);

      if (paymentMethod === 'VNPAY' && paymentURL) {
        // Chuyển hướng đến VNPAY với orderId
        window.location.href = paymentURL;
      } else {
        navigate('/thankyou', {
          state: {
            orderId: response._id,
            address: addresses.find(addr => addr._id === selectedAddressId)
          }
        });
      }
    } catch (error) {
      message.error('Đặt hàng thất bại: ' + error.message);
      console.error('Lỗi khi tạo đơn hàng:', error);
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

  const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);

  return (
    <div className="mt-16 px-8 py-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

      {
        displayItems.length === 0
          ? (
            <Card className="text-center">
              <p className="text-lg">Chưa chọn sản phẩm nào để mua.</p>
              <Button type="primary" href="/cart" className="mt-4">
                Xem giỏ hàng
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <Card
                  title={<span><EnvironmentOutlined className="mr-2" /> Địa chỉ giao hàng</span>}
                  className="w-full mb-6"
                  extra={
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => setOpenAddressList(true)}
                      disabled={addresses.length === 0}
                    >
                      Thay đổi
                    </Button>
                  }
                >
                  {selectedAddress ? (
                    <div>
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {selectedAddress.fullName} | {selectedAddress.phone}
                        </p>
                        {selectedAddress.isDefault && <Tag color="blue">Mặc định</Tag>}
                      </div>
                      <p className="mt-2 text-gray-600">
                        {selectedAddress.detail}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setOpenNewAddressModal(true)}
                      >
                        Thêm địa chỉ mới
                      </Button>
                    </div>
                  )}
                </Card>
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
                </Card>
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
                    className="h-12 w-full sm:w-[200px] text-lg font-medium hover:bg-[#ee4d2d]/90 border-none"
                  >
                    Đặt hàng
                  </Button>
                </div>

              </div>


            </div>
          )}

      {/* Modal chọn địa chỉ có sẵn */}
      <Modal
        title="Chọn địa chỉ giao hàng"
        open={openAddressList}
        onCancel={() => setOpenAddressList(false)}
        footer={[
          <Button key="add" type="dashed" icon={<PlusOutlined />} onClick={() => {
            setOpenAddressList(false);
            setOpenNewAddressModal(true);
          }}>
            Thêm địa chỉ mới
          </Button>,
          <Button key="cancel" onClick={() => setOpenAddressList(false)}>
            Đóng
          </Button>
        ]}
      >
        <div className="max-h-96 overflow-y-auto">
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map(address => (
                <Card
                  key={address._id}
                  hoverable
                  onClick={() => {
                    setSelectedAddressId(address._id);
                    setOpenAddressList(false);
                  }}
                  className={`cursor-pointer ${selectedAddressId === address._id ? 'border-blue-500' : ''}`}
                >
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {address.fullName} | {address.phone}
                    </p>
                    {address.isDefault && <Tag color="blue">Mặc định</Tag>}
                  </div>
                  <p className="mt-2 text-gray-600">
                    {address.detail}, {address.ward}, {address.district}, {address.province}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpenAddressList(false);
                  setOpenNewAddressModal(true);
                }}
              >
                Thêm địa chỉ mới
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal thêm địa chỉ mới */}
      <Modal
        title="Thêm địa chỉ mới"
        open={openNewAddressModal}
        onCancel={() => {
          setOpenNewAddressModal(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fullName: userData?.name || '',
            phone: userData?.phone || '',
            isDefault: false
          }}
          onFinish={handleAddressSubmit}
        >
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <AddressSelector form={form} />

          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => setOpenNewAddressModal(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Lưu địa chỉ
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Checkout1;