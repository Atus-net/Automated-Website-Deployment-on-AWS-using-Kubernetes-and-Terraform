// import & hooks giữ nguyên
import { Form, Input } from 'antd';
import './index.css';
import { Pencil } from 'lucide-react';
import avatar from '~/assets/default_avt.jpg';
import { useRef, useState, useEffect } from 'react';
import { getCurrentUser, updateImageUser, updateUser } from '~/api/apiUser';
import { setUser } from '~/redux/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const AccountProfile = ({ currentUser, instance }) => {
  const [form] = Form.useForm();
  const [editProfile, setEditProfile] = useState({ name: false, email: false, phone: false });
  const [image, setImage] = useState('');
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const userData = currentUser?.user || currentUser?.data || currentUser;
  // const loginType = localStorage.getItem('login_type');
  // const token = loginType === 'google' ? null : currentUser?.access_token || currentUser?.accessToken;

  const refreshUser = async () => {
    const userId = userData?.id || userData?._id;
    if (!userId) {
      console.warn('Không có userId hợp lệ');
      return;
    }

    try {
      const res = await getCurrentUser(userId);
      dispatch(
        setUser({
          ...currentUser,
          user: res.data,
        }),
      );
      // const loginType = localStorage.getItem('login_type');
      // if (loginType === 'normal') {
      //   const access = currentUser?.access_token || currentUser?.accessToken;
      //   if (access) {
      //     localStorage.setItem('access_token', access);
      //   }
      // }
      form.setFieldsValue(res.data);
    } catch (err) {
      console.error('Lỗi khi refreshUser:', err.message);
    }
  };

  useEffect(() => {
    if (userData) form.setFieldsValue(userData);
  }, [currentUser]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    try {
      await updateImageUser(file);
      await refreshUser();
    } catch (err) {
      console.error('Lỗi khi upload ảnh:', err.response?.data || err.message);
      toast.error('Tải ảnh thất bại!', { position: 'bottom-right' });
    }
  };

  const handleSubmit = async (values) => {
    const userId = userData?.id || userData?._id;
    if (!userId) {
      toast.error('Thiếu thông tin người dùng!');
      return;
    }

    try {
      await updateUser({ id: userId, ...values });
      toast.success('Cập nhật thành công!', { position: 'bottom-right', autoClose: 3000 });
      await refreshUser();
      setEditProfile({ name: false, email: false, phone: false });
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err.response?.data || err.message);
      toast.error('Lỗi khi cập nhật!', { position: 'bottom-right' });
    }
  };

  if (!userData?.name && !userData?.email) {
    return <p>Không tìm thấy thông tin người dùng.</p>;
  }

  return (
    <div className="flex-col">
      <div className="flex basis-1/3 flex-col items-center justify-center w-full">
        <div className="relative size-40 rounded-full border-2">
          <img
            src={image ? URL.createObjectURL(image) : userData?.profile_picture || userData?.avatar || avatar}
            alt="Ảnh đại diện"
            className="absolute right-0 top-0 size-40 rounded-full"
          />
          <input type="file" className="hidden" ref={inputRef} onChange={handleImage} />
          <div
            onClick={() => inputRef.current.click()}
            className="absolute bottom-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:text-amber-300"
          >
            <Pencil size={20} />
          </div>
        </div>
      </div>

      <div className="relative basis-2/3">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
            <Input
              disabled={!editProfile.email}
              onClick={() => setEditProfile((prev) => ({ ...prev, email: prev.email }))} //email: !prev.email
              // suffix={
              //   <Pencil
              //     onClick={() => setEditProfile((prev) => ({ ...prev, email: prev.email }))} //email: !prev.email
              //     className="cursor-pointer text-black/30 hover:text-black/60"
              //   />
              // }
            />
          </Form.Item>

          <Form.Item label="Họ tên" name="name">
            <Input
              disabled={!editProfile.name}
              suffix={
                <Pencil
                  onClick={() => setEditProfile((prev) => ({ ...prev, name: !prev.name }))}
                  className="cursor-pointer text-black/30 hover:text-black/60"
                />
              }
            />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input
              disabled={!editProfile.phone}
              suffix={
                <Pencil
                  onClick={() => setEditProfile((prev) => ({ ...prev, phone: !prev.phone }))}
                  className="cursor-pointer text-black/30 hover:text-black/60"
                />
              }
            />
          </Form.Item>

          <Form.Item>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-[6px] border-[none] bg-[#664545] p-[10px] text-[1rem] text-white hover:bg-[#7a4f4f] active:bg-[#523636]"
            >
              Cập nhật hồ sơ
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AccountProfile;
