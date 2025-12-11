import { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { changePasswordFromMail } from '~/api/apiUser';

function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const token = new URLSearchParams(location.search).get('token');
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

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ mật khẩu.', {
        position: 'bottom-right',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.', {
        position: 'bottom-right',
      });
      return;
    }

    console.log('Token gửi lên:', token);
    try {
      const res = await changePasswordFromMail({
        token,
        newPassword,
        confirmPassword,
      });

      toast.success(res.message || 'Đặt lại mật khẩu thành công!', {
        position: 'bottom-right',
      });

      setTimeout(() => {
        navigate('/auth?mode=signin');
      }, 2000);
    } catch (error) {
      console.error('Lỗi khi reset mật khẩu:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.', {
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="mb-5 mt-16 h-fit w-full bg-slate-50">
      <div className="mx-[5rem]">
        <div className="flex h-11 items-center text-primary">
          <div className="capitalize">
            <NavLink to="/">Trang chủ </NavLink>
            <span>&gt;&gt;</span>
            <NavLink to="/category"> Đặt lại mật khẩu </NavLink>
          </div>
        </div>

        <div className="my-10">
          <div className="flex h-12 w-11/12 items-center bg-[#455666]">
            <p className="ml-5 text-sm text-slate-50">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4">
          {/* Mật khẩu mới */}
          <label className="relative">
            Mật khẩu mới
            <input
              type={hidden.password ? 'password' : 'text'}
              className="mx-2 mt-2 w-64 rounded-xl border border-primary p-2 pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <i
              className="absolute right-3 top-7 mx-1 -translate-y-1/2 cursor-pointer hover:text-slate-900"
              onClick={() => hiddenPassword('password')}
            >
              {hidden.password ? <FaEyeSlash className="text-slate-500" /> : <FaEye />}
            </i>
          </label>

          {/* Xác nhận mật khẩu */}
          <label className="relative">
            Xác nhận mật khẩu
            <input
              type={hidden.confirm ? 'password' : 'text'}
              className="mx-2 mt-2 w-64 rounded-xl border border-primary p-2 pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <i
              className="absolute right-3 top-7 mx-1 -translate-y-1/2 cursor-pointer hover:text-slate-900"
              onClick={() => hiddenPassword('confirm')}
            >
              {hidden.confirm ? <FaEyeSlash className="text-slate-500" /> : <FaEye />}
            </i>
          </label>

          <button
            onClick={handleSubmit}
            className="mt-4 rounded-lg bg-primary px-6 py-3 text-sm uppercase text-slate-50 hover:bg-secondary hover:text-black"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
