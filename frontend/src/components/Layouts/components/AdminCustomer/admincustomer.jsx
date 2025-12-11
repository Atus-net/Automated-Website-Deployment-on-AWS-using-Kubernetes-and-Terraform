import React, { useEffect, useState } from 'react';
import { getListUsers, toggleUserActive, updateUserRoleWithAuth } from '~/api/apiUser';
import { getOrders } from '~/api/apiOrder';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function AdminCustomer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hidden, setHidden] = useState({
    password: true,
    confirm: true,
  });

  const hiddenPassword = (field) => {
    setHidden((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([getListUsers(), getOrders()]);
        const orders = orderRes.data || [];
        const enrichedUsers = userRes.data.map((user) => {
          const userOrders = orders.filter((order) => order.user === user.id);
          return { ...user, orderCount: userOrders.length };
        });
        setUsers(enrichedUsers);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách khách hàng');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleActive = async (userId, newActiveState) => {
    try {
      const res = await toggleUserActive(userId, newActiveState);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: res.data.isActive } : u)));
      toast.success(`Đã cập nhật trạng thái`, {
        position: 'bottom-right',
        autoClose: 3000,
        icon: '✅',
      });
    } catch (err) {
      alert('Không thể cập nhật trạng thái hoạt động');
    }
  };

  const handleOpenConfirm = (user) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  const handleConfirmChangeRole = async () => {
    try {
      const res = await updateUserRoleWithAuth(selectedUser.id, password, !selectedUser.isAdmin);
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, isAdmin: res.data.isAdmin } : u)));
      setConfirmOpen(false);
      setPassword('');
      toast.success(`Đã cập nhật phân quyền cho ${selectedUser.name}`, {
        position: 'bottom-right',
        autoClose: 3000,
        icon: '✅',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật quyền thất bại', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  if (loading) return <p>Đang tải danh sách khách hàng...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-[x-large] font-bold text-[#664545]">Khách hàng thành viên</h1>

      <div className="overflow-x-auto text-sm">
        <table className="w-full table-auto border-collapse overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <thead className="bg-gray-50 text-sm font-semibold text-gray-700">
            <tr>
              <th className="border-y border-gray-200 px-4 py-3 text-center">STT</th>
              <th className="border-y border-gray-200 px-4 py-3 text-center">Tên khách hàng</th>
              <th className="border-y border-gray-200 px-4 py-3 text-center">Email</th>
              <th className="border-y border-gray-200 px-4 py-3 text-center">Số điện thoại</th>
              <th className="border-y border-gray-200 px-4 py-3 text-center">Số đơn</th>
              <th className="border-y border-gray-200 px-4 py-3 text-center">Phân quyền</th>
              <th className="border-y border-gray-200 px-4 py-3 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr key={user.id} className="text-gray-800 transition-all hover:bg-gray-100">
                <td className="border-y border-gray-200 py-3 text-center">{index + 1}</td>
                <td className="border-y border-gray-200 px-4 py-3 text-center">{user.name}</td>
                <td className="border-y border-gray-200 px-4 py-3 text-center">{user.email}</td>
                <td className="border-y border-gray-200 px-4 py-3 text-center">{user.phone}</td>
                <td className="border-y border-gray-200 px-4 py-3 text-center">{user.orderCount}</td>
                <td className="border-y border-gray-200 px-4 py-3 text-center">
                  <span
                    onClick={() => handleOpenConfirm(user)}
                    className={`cursor-pointer rounded px-3 py-1 text-white transition ${
                      user.isAdmin ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                {/* <td className="border-y border-gray-200 px-4 py-3 text-center">
                  <span
                    onClick={() => handleToggleActive(user)}
                    className={`cursor-pointer rounded px-3 py-1 text-sm font-medium text-white transition ${
                      user.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {user.isActive ? '✅ Đang hoạt động' : '⚠️ Vô hiệu hóa'}
                  </span>
                </td> */}
                <td className="border-y border-gray-200 px-4 py-3 text-center">
                  <select
                    value={user.isActive ? 'true' : 'false'}
                    onChange={(e) => handleToggleActive(user.id, e.target.value === 'true')}
                    className="cursor-pointer rounded px-3 py-1 text-sm font-medium text-black transition"
                  >
                    <option value="true" className="font-medium text-green-600">
                      ✅ Đang hoạt động
                    </option>
                    <option value="false" className="font-medium text-red-500">
                      ⚠️ Vô hiệu hóa
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận thay đổi phân quyền thành {selectedUser?.isAdmin ? 'User' : 'Admin'}</DialogTitle>
        <DialogContent>
          <div className="relative">
            <TextField
              type={hidden.password ? 'password' : 'text'}
              label="Nhập mật khẩu xác nhận"
              fullWidth
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmChangeRole();
              }}
            />
            <i
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => hiddenPassword('password')}
            >
              {hidden.password ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-700" />}
            </i>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirmChangeRole}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminCustomer;
