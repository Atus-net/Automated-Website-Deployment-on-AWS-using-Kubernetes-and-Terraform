import { Table, Button } from 'antd';
import { useEffect, useState } from 'react';
import { getOrders } from '~/api/apiOrder';
import { createPaymentUrl } from '~/api/apiPayment';
const AccountOrders = ({ currentUser, instance }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const res = await getOrders();

        const data = res?.data || [];

        const isEmpty = data.length === 0 || (data.length === 1 && (!data[0]?.items || data[0]?.items.length === 0));

        if (isEmpty) {
          setOrders([]);
        } else {
          const mappedOrders = data.map((order, index) => ({
            key: order._id || index,
            'product-detail': order.items
              .map(
                (item) =>
                  `${item.product?.productName || 'Tên sản phẩm'} (Số lượng: ${item.quantity}, Đơn giá: ${item.price.toLocaleString()}đ)`,
              )
              .join(', '),
            'payment-method': order.paymentMethod?.toUpperCase() || 'N/A',
            'pay-amount': `${order.totalPrice?.toLocaleString() || 0}đ`,
            'payment-status': order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán',
            'order-status': order.orderStatus || 'pending',
            orderId: order._id, // để xử lý click thanh toán
          }));

          setOrders(mappedOrders);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrderList();
  }, [currentUser, instance]);

  const handlePayment = async (orderId) => {
    try {
      const { paymentUrl } = await createPaymentUrl(orderId); // Gọi API tạo URL thanh toán
      console.log('url:', paymentUrl);
      if (paymentUrl) {
        window.location.href = paymentUrl; // Chuyển hướng đến trang thanh toán
      }
    } catch (err) {
      console.error('Lỗi thanh toán:', err);
    }
  };

  const columns = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
      key: 'stt',
    },
    {
      title: 'Chi tiết sản phẩm',
      dataIndex: 'product-detail',
      key: 'product-detail',
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'payment-method',
      key: 'payment-method',
    },
    {
      title: 'Số tiền thanh toán',
      key: 'pay-amount',
      render: (_, record) => (
        <div className="flex flex-col items-center">
          <div>{record['pay-amount']}</div>
          {record['payment-status'] === 'Chưa thanh toán' && record['payment-method'] === 'VNPAY' ? (
            <Button type="primary" size="small" className="mt-1" onClick={() => handlePayment(record.orderId)}>
              Thanh toán
            </Button>
          ) : record['payment-method'] === 'COD' ? (
            <span className="mt-1 text-sm text-red-600">{record['payment-status']}</span>
          ) : (
            <span className="mt-1 text-sm text-green-600">Đã thanh toán</span>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái đơn hàng',
      key: 'order-status',
      render: (_, record) => {
        switch (record['order-status']) {
          case 'pending':
            return <span className="text-gray-500">Đang chờ xử lý</span>;
          case 'processing':
            return <span className="text-blue-500">Đang xử lý</span>;
          case 'shipping':
            return <span className="text-yellow-500">Đang giao</span>;
          case 'delivered':
            return <span className="text-green-600">Đã giao</span>;
          case 'cancelled':
            return <span className="text-red-500">Đã hủy</span>;
          default:
            return <span>Chưa xác định</span>;
        }
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={orders}
        scroll={{ x: 800 }}
        locale={{
          emptyText: 'Chưa có đơn hàng',
        }}
        pagination={false}
      />
    </>
  );
};

export default AccountOrders;
