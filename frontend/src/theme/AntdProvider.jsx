// src/theme/AntdProvider.jsx
import { ConfigProvider } from 'antd';

const AntdProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#664545',
          colorLinkHover: '#e2556e',
          // activeBorderColor: '#664545',
          // hoverBorderColor: '#664545',
          // hoverBgColor: '#fff0f2',
          // colorPrimaryHover: '#664545',
          // colorPrimaryActive: '#664545',
          // activeBorderColor: '#664545',
        },
        components: {
          Button: {
            colorPrimary: '#664545',
            colorPrimaryHover: '#ff4f67',
          },
          Table: {
            rowHoverBg: '#fff0f2',
            rowSelectedBg: '#fff0f2',
            rowSelectedHoverBg: '#ffe6ea',
          },
          Input: {
            // colorPrimary: '#664545',
            // colorPrimaryHover: '#664545',
            // colorPrimaryActive: '#664545',
            borderColor: '#664545',
            borderRadius: 4,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
