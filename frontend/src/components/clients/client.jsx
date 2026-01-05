'use client';
import { Dropdown, Tooltip } from 'flowbite-react';
import avatar from '~/assets/default_avt.jpg';
import { Link } from 'react-router-dom';
export function DropdownLib({ label, items, props }) {
  return (
    <Dropdown {...props} label={label} dismissOnClick={false}>
      {items?.map((item, index) => (
        <Dropdown.Item key={index}>{item}</Dropdown.Item>
      ))}
    </Dropdown>
  );
}
const customThemeTooltip = {
  target: 'w-fit',
  animation: 'transition-opacity',
  arrow: {
    base: 'absolute z-10 h-2 w-2 rotate-45 group',
    style: {
      dark: 'bg-slate-50 dark:bg-gray-700',
      light: 'bg-white',
      auto: 'bg-white dark:bg-gray-700',
    },
    placement: '-4px',
  },
  base: 'absolute z-10 inline-block rounded-lg  text-sm font-medium shadow-sm',
  hidden: 'invisible opacity-0',
  style: {
    dark: 'bg-slate-50 text-black dark:bg-gray-700',
    light: 'border border-gray-200 bg-white text-gray-900',
    auto: 'border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white',
  },
  content: 'relative z-20',
};
export function UserTooltip({ onClick, currentUser }) {
  // console.log('👉 currentUser trong UserTooltip:', currentUser);
  // console.log('👉 currentUser admin trong UserTooltip:', currentUser?.data?.isAdmin);
  // console.log('👉 currentUser admin trong UserTooltip:', currentUser?.isAdmin);
  console.log(currentUser);
  return (
    <Tooltip
      theme={customThemeTooltip}
      content={
        <div>
          <ul className="">
            <Link to="/account">
              <li className="rounded-tl-lg rounded-tr-lg px-3 py-2 hover:text-fourth">Tài khoản của tôi</li>
            </Link>
            <Link to="/account/orders">
              <li className="px-3 py-2 hover:text-fourth">Lịch sử mua hàng</li>
            </Link>
            {(currentUser?.data?.isAdmin || currentUser?.isAdmin) && (
              <Link to="/admin/dashboard">
                <li className="rounded-tl-lg rounded-tr-lg px-3 py-2 hover:text-fourth">Công cụ quản lí</li>
              </Link>
            )}
            <button onClick={() => onClick()}>
              <li className="rounded-bl-lg rounded-br-lg px-3 py-2 hover:text-fourth">Đăng xuất</li>
            </button>
          </ul>
        </div>
      }
    >
      <img
        src={currentUser?.avatar || currentUser?.data.avatar || avatar}
        alt="User account"
        className="h-7 w-7 rounded-full border-2"
      />
    </Tooltip>
  );
}
