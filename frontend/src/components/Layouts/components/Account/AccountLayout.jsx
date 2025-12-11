import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import BreadCrumb from '~/components/Layouts/components/Breadcrumb';
import { useSelector } from 'react-redux';
import { createInstance } from '~/redux/interceptors';
import { loginSuccess } from '~/redux/authSlice';
import { useLocation } from 'react-router-dom';

const AccountLayout = () => {
  const [currentKey, setCurrentKey] = useState('profile');

  const [breadCrumbItems, setBreadcrumbItems] = useState([{ title: 'Trang chủ', link: '/' }, { title: 'Tài khoản' }]);

  const [pageTitle, setPageTitle] = useState('Tài khoản');
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const instance = createInstance(currentUser, null, loginSuccess);
  const menuMapping = {
    profile: {
      link: '/account/profile',
      title: 'Tài khoản',
    },
    address: {
      link: '/account/address',
      title: 'Địa chỉ giao hàng',
    },
    'change-password': {
      link: '/account/change-password',
      title: 'Đổi mật khẩu',
    },
    orders: {
      link: '/account/orders',
      title: 'Đơn hàng',
    },
  };

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let matchedKey = 'profile'; // default

    // So khớp URL với menuMapping
    Object.keys(menuMapping).forEach((key) => {
      if (menuMapping[key].link === path) {
        matchedKey = key;
      }
    });

    setCurrentKey(matchedKey);
    const menu = menuMapping[matchedKey];
    setBreadcrumbItems([
      { title: 'Trang chủ', link: '/' },
      { title: menu.title, link: menu.link },
    ]);
    setPageTitle(menu.title);
  }, [location.pathname]); // chạy mỗi khi URL thay đổi

  const handleUpdateContent = (key) => {
    const menu = menuMapping[key];

    if (menu) {
      setCurrentKey(key);
      setBreadcrumbItems([
        { title: 'Trang chủ', link: '/' },
        { title: menu.title, link: menu.link },
      ]);
      setPageTitle(menu.title);
    }
  };

  return (
    <>
      <BreadCrumb items={breadCrumbItems} />
      <div className="pt-4 text-center text-3xl font-bold leading-tight md:pt-8 md:text-5xl md:leading-[72px]">
        {pageTitle}
      </div>
      <Sidebar
        currentKey={currentKey}
        handleUpdateContent={handleUpdateContent}
        currentUser={currentUser}
        instance={instance}
      />
    </>
  );
};

export default AccountLayout;
