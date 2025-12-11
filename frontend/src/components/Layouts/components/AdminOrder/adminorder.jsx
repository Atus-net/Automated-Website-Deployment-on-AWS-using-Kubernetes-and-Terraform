import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getOrders, updateOrderStatus } from '~/api/apiOrder';
import { getListUsers, getAllAddress } from '~/api/apiUser';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDialog, setStatusDialog] = useState({ open: false, orderId: null, newStatus: '' });
  const user = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, userRes, addressRes] = await Promise.all([getOrders(), getListUsers(), getAllAddress()]);
        console.log(orderRes);
        const updatedOrders = await Promise.all(
          orderRes.data.map(async (order) => {
            if (order.paymentMethod === 'VNPAY' && order.paymentStatus === 'paid') {
              try {
                const updateRes = await updatepaymentStatus(order._id, 'processing');
                return { ...order, paymentStatus: updateRes.data.paymentStatus };
              } catch {
                return order;
              }
            } else if (order.paymentMethod === 'VNPAY' && order.paymentStatus === 'pending') {
              try {
                const updateRes = await updatepaymentStatus(order._id, 'pending');
                return { ...order, paymentStatus: updateRes.data.paymentStatus };
              } catch {
                return order;
              }
            }
            return order;
          }),
        );

        setOrders(updatedOrders);
        setUsers(userRes.data);
        setAddresses(addressRes);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserInfo = (userId) => users.find((u) => u.id === userId);
  const getUserDefaultAddress = (userId) =>
    addresses.find((addr) => addr.user === userId && addr.isDefault) || addresses.find((addr) => addr.user === userId);
  const handleUpdateStatus = (orderId, newStatus) => {
    setStatusDialog({ open: true, orderId, newStatus });
  };
  const getReceiverFromOrder = (order) => {
    if (order.address) {
      return {
        fullName: order.address.fullName,
        phone: order.address.phone,
        detail: order.address.detail,
        ward: order.address.ward,
        district: order.address.district,
        province: order.address.province,
      };
    }
    return getUserDefaultAddress(order.user);
  };

  const confirmUpdateStatus = async () => {
    try {
      const { orderId, newStatus } = statusDialog;
      const res = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, orderStatus: res.data.orderStatus } : o)));
      toast.success(`Đã chuyển trạng thái sang ${newStatus}`, {
        position: 'bottom-right',
        autoClose: 3000,
        icon: '✅',
      });
    } catch (err) {
      toast.error('Cập nhật trạng thái thất bại', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setStatusDialog({ open: false, orderId: null, newStatus: '' });
    }
  };
  const formatAddress = (receiver) =>
    receiver ? `${receiver.detail}, ${receiver.ward}, ${receiver.district}, ${receiver.province}` : 'N/A';

  if (loading) return <p>Đang tải danh sách đơn hàng...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-[x-large] font-bold text-[#664545]">Quản lý đơn hàng</h1>
      <div className="overflow-x-auto text-sm">
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">Chưa có đơn hàng nào.</p>
        ) : (
          <table className="w-full table-auto border-collapse overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <thead className="bg-gray-50 text-sm font-semibold text-gray-700">
              <tr>
                <th className="border-y border-gray-200 px-4 py-3 text-center">STT</th>
                <th className="border-y border-gray-200 px-4 py-3 text-center">Thông tin khách hàng</th>
                <th className="border-y border-gray-200 px-4 py-3 text-center">Chi tiết đơn hàng</th>
                <th className="border-y border-gray-200 px-4 py-3 text-center">Phương thức thanh toán</th>
                <th className="border-y border-gray-200 px-4 py-3 text-center">Trạng thái đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const userInfo = getUserInfo(order.user);
                const receiver = getReceiverFromOrder(order);
                return (
                  <tr key={order._id} className="text-gray-800 transition-all hover:bg-gray-100">
                    <td className="border-y border-gray-200 py-3 text-center">{index + 1}</td>
                    <td className="border-y border-gray-200 px-4 py-3 text-left">
                      <p className="font-medium">{userInfo?.name || 'N/A'}</p>
                      <p>{userInfo?.phone || 'N/A'}</p>
                      <p>{userInfo?.email || 'N/A'}</p>
                    </td>
                    <td className="border-y border-gray-200 px-4 py-3 text-left">
                      {order.items.map((item, i) => (
                        <p key={i}>
                          {item.product?.productName} (x{item.quantity})
                        </p>
                      ))}
                      <p className="mt-1 font-semibold">Tổng: {order.totalPrice.toLocaleString()}đ</p>
                      <p>
                        Trạng thái thanh toán:{' '}
                        <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}>
                          {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </p>
                      <p className="mt-2 font-medium">Người nhận: {receiver?.fullName || 'N/A'}</p>
                      <p>SĐT: {receiver?.phone || 'N/A'}</p>
                      <p>Địa chỉ: {formatAddress(receiver)}</p>
                    </td>
                    <td className="border-y border-gray-200 px-4 py-3 text-center uppercase">{order.paymentMethod}</td>
                    <td className="border-y border-gray-200 px-4 py-3 text-center">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="rounded border px-2 py-1 text-sm shadow"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipping">Shipping</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ open: false, orderId: null, newStatus: '' })}>
        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc muốn thay đổi trạng thái đơn hàng thành "{statusDialog.newStatus}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ open: false, orderId: null, newStatus: '' })}>Hủy</Button>
          <Button variant="contained" onClick={confirmUpdateStatus}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminOrder;
