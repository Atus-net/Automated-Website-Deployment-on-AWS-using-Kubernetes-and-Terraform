import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, message } from 'antd';
import { useCart } from './hooks';
import CartTable from './CartTable';
import CartActions from './CartActions';
import CartModal from './CartModal';
import { useLocation, useNavigate } from 'react-router-dom';

const { Text } = Typography;

const Cart = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('');
  const location = useLocation();

  const user = useSelector((state) => state.auth.login.currentUser);
  const { cartItems, removeItem, removeMultipleItems, updateItemQuantity } = useCart(user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.autoSelectedKey || !location.state?.isBuyNow) return;
    if (!cartItems || cartItems.length === 0) return;

    const productId = location.state.autoSelectedKey;
    const targetItem = cartItems.find(item => item.product._id === productId);

    if (targetItem) {
      setSelectedRowKeys([productId]);
      setSelectedItemIds([targetItem._id]);
    }
  }, [location.state, cartItems]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);

    // Tính toán selectedItemIds tương ứng
    const newSelectedItemIds = cartItems
      .filter(item => newSelectedRowKeys.includes(item.product._id))
      .map(item => item._id);

    setSelectedItemIds(newSelectedItemIds);
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    console.log('selectedItemIds changed: ', newSelectedItemIds);
  };



  const showModal = () => {
    setOpen(true);
    setModalText(`Bạn có muốn bỏ ${selectedRowKeys.length} sản phẩm khỏi giỏ hàng?`);
  };

  const handleOk = async () => {
    setModalText('Đang xử lý...');
    setConfirmLoading(true);
    try {
      await removeMultipleItems(selectedRowKeys);
      setSelectedRowKeys([]);
      setSelectedItemIds([]);
      message.success('Xóa thành công');
    } catch (err) {
      console.error(err);
      message.error('Xóa thất bại');
    } finally {
      setConfirmLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleQuantityChange = async (productId, quantity) => {
    try {
      await updateItemQuantity(productId, quantity);
      message.success('Cập nhật thành công');
    } catch (error) {
      message.error('Cập nhật thất bại');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeItem(productId);
      message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (err) {
      message.error('Xóa thất bại');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.error('Giỏ hàng trống');
      return;
    }
    // Tạo unique state ID (để tránh cache)
    const stateId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    // Lưu vào localStorage với key có prefix
    localStorage.setItem(`checkoutState_${stateId}`, JSON.stringify({
      cartItems,
      selectedRowKeys,
      selectedItemIds
    }));


    navigate(`/checkout?state=${stateId}`, {

      state: {

        cartItems: cartItems, // Truyền toàn bộ giỏ hàng
        selectedItems: selectedItemIds.length > 0
          ? cartItems.filter(item => selectedItemIds.includes(item._id))
          : cartItems, // Nếu không chọn thì truyền tất cả
        totalAmount: selectedItemIds.length > 0
          ? selectedItemIds.reduce((sum, itemId) => {
            const item = cartItems.find(cartItem => cartItem._id === itemId);
            return sum + (item ? item.product.price * item.quantity : 0);
          }, 0)
          : cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const dataSource = cartItems.map((item) => ({
    key: item.product._id,
    itemId: item._id,
    product: {
      name: item.product.productName,
      image: item.product.imageLink,
    },
    price: formatCurrency(item.product.price),
    quantity: item.quantity,
    total: formatCurrency(item.product.price * item.quantity),
  }));

  const totalAmount = formatCurrency(
    selectedRowKeys.reduce((sum, key) => {
      const item = cartItems.find((cartItem) => cartItem.product._id === key);
      return sum + (item ? item.product.price * item.quantity : 0);
    }, 0)
  );

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="mt-16 w-full bg-white pb-16">
      <div className="mx-4 sm:mx-8 lg:mx-[5rem]">
        <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold leading-[48px] sm:leading-[56px] lg:leading-[72px] mt-10">
          Giỏ hàng
        </h1>
        <Text className="block py-5 text-center text-sm sm:text-base lg:text-lg font-normal">
          Nơi cập nhật những trạng thái tốt nhất
        </Text>
        <div className="flex flex-col gap-6">
          <CartTable
            dataSource={dataSource}
            rowSelection={rowSelection}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
          />
          <div className="sticky bottom-0 z-10 bg-white p-4">
            <CartActions
              hasSelected={hasSelected}
              onRemoveSelected={showModal}
              onCheckout={handleCheckout}
              selectedCount={selectedRowKeys.length}
              totalAmount={totalAmount}
            />
            <CartModal
              open={open}
              onOk={handleOk}
              onCancel={handleCancel}
              confirmLoading={confirmLoading}
              modalText={modalText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;