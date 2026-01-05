import { createInstance } from '~/redux/interceptors';
import AccountAddress from './contents/Address';
import AccountChangePassword from './contents/ChangePassword';
import AccountOrders from './contents/Orders';
import AccountProfile from './contents/Profile';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '~/redux/authSlice';
import { useEffect } from 'react';

const SidebarContent = ({ currentKey, handleUpdateContent }) => {
  const { currentUser } = useSelector((state) => state.auth.login);
  const dispatch = useDispatch();

  if (!currentUser) {
    return <p className="py-10 text-center">Đang tải dữ liệu người dùng...</p>;
  }

  const instance = createInstance(currentUser, dispatch, loginSuccess);

  useEffect(() => {
    handleUpdateContent(currentKey);
  }, []);

  let content;
  switch (currentKey) {
    case 'profile':
      content = <AccountProfile currentUser={currentUser} instance={instance} />;
      break;
    case 'address':
      content = <AccountAddress currentUser={currentUser} instance={instance} />;
      break;
    case 'change-password':
      content = <AccountChangePassword currentUser={currentUser} instance={instance} />;
      break;
    case 'orders':
      content = <AccountOrders currentUser={currentUser} instance={instance} />;
      break;
    default:
      content = <AccountProfile currentUser={currentUser} instance={instance} />;
  }

  return (
    <div className="h-fit rounded-[8px] border-[1px] border-[#ccc] bg-[#fff]">
      <div className="mx-[16px] my-[16px]">{content}</div>
    </div>
  );
};

export default SidebarContent;
