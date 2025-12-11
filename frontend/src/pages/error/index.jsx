// src/pages/NotFound.jsx
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="my-16 mb-8 ml-12 flex flex-col items-center justify-center text-center">
    <Result
      status="404"
      title="404 error"
      subTitle="Xin lỗi, trang bạn tìm không tồn tại."
      extra={
        <Link to="/">
          <Button type="primary">Về trang chủ</Button>
        </Link>
      }
    />
  </div>
);

export default NotFound;
