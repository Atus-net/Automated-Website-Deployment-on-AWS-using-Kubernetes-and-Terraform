# 🎂 Dolciluxe - Thương hiệu bánh ngọt cao cấp

## ✨ Giới thiệu

Dolciluxe là nền tảng thương mại điện tử chuyên về bánh ngọt cao cấp, kết hợp trải nghiệm mua sắm hiện đại với phong cách sang trọng.

## 🌟 Tính năng nổi bật

### 🛍️ Khách hàng

| Tính năng | Mô tả |
| --- | --- |
| 🏠 Trang chủ | Hiển thị sản phẩm nổi bật, danh mục |
| 🔍 Tìm kiếm | Lọc sản phẩm theo giá, danh mục |
| 🛒 Giỏ hàng | Thêm/Xóa/Sửa số lượng sản phẩm |
| 💳 Thanh toán | Hỗ trợ thanh toán qua VNPay  |
| 📦 Theo dõi đơn hàng | Cập nhật trạng thái đơn hàng real-time |
| 🔐 Tài khoản | Đăng nhập bằng Google/JWT, đổi mật khẩu |

### 🛠️ Quản trị viên

| Tính năng | Mô tả |
| --- | --- |
| 🧑‍💼 Quản lý người dùng | Xem/Chặn người dùng |
| 🍰 Quản lý sản phẩm | CRUD sản phẩm |
| 📦 Quản lý đơn hàng | Cập nhật trạng thái đơn hàng |

## 🛠 Công nghệ sử dụng

### Frontend

[](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)

[](https://img.shields.io/badge/Redux_Toolkit-1.9.5-764ABC?logo=redux)

[](https://img.shields.io/badge/Tailwind_CSS-3.3.3-06B6D4?logo=tailwind-css)

- **React.js 18**: Framework chính
- **Redux Toolkit**: Quản lý global state
- **Axios**: Xử lý API calls
- **React Router v6**: Điều hướng SPA
- **Tailwind CSS**: Styling với utility-first
- **Ant Design**: UI components
- **Formik + Yup**: Xử lý form validation

### Backend

[](https://img.shields.io/badge/Node.js-18.16.0-339933?logo=node.js)

[](https://img.shields.io/badge/Express-4.18.2-000000?logo=express)

[](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)

- **Node.js 18**: Runtime environment
- **Express.js**: Xây dựng REST API
- **MongoDB Atlas**: Cloud database
- **Mongoose 7**: ODM cho MongoDB
- **JWT**: Xác thực người dùng
- **Bcrypt**: Mã hóa mật khẩu
- **Nodemailer**: Gửi email xác nhận
- **Cloudinary**: Lưu trữ hình ảnh

## 📂 Cấu trúc thư mục

### Backend

```bash
backend/
├── app/               # Khởi tạo ứng dụng Express
├── configs/           # Cấu hình database, VNPay, Passport.js
├── controllers/       # Xử lý logic nghiệp vụ
├── database/          # Kết nối MongoDB
├── middleware/        # Xác thực JWT và middleware khác
├── models/            # Định nghĩa schema MongoDB
├── routes/            # Định tuyến API endpoints
├── services/          # Xử lý nghiệp vụ phức tạp
└── utils/             # Tiện ích (gửi email, helper functions)
```

### Frontend

```bash
frontend/
├── public/            # Tài nguyên tĩnh (favicon, assets)
└── src/
    ├── api/           # Axios API clients
    ├── assets/        # Hình ảnh, icons
    ├── components/    # Component tái sử dụng
    │   ├── Layouts/   # Bố cục chính
    │   └── ...        # Các component khác
    ├── hooks/         # Custom React hooks
    ├── pages/         # Các trang chính
    ├── redux/         # Quản lý global state
    ├── routes/        # Cấu hình định tuyến
    ├── services/      # Cấu hình Axios
    └── theme/         # Cài đặt giao diện
```

## 🚀 Cài đặt dự án

### Yêu cầu hệ thống

- Node.js ≥ 18.x
- MongoDB ≥ 6.0
- Yarn (khuyến nghị) hoặc npm

### Các bước triển khai

```bash
# 1. Clone repository
git clone <https://github.com/locphp/dolciluxe.git>
cd dolciluxe

# 2. Cài đặt backend
cd backend
cp .env.example .env  # Điền thông tin thực tế
npm install
npm run dev

# 3. Cài đặt frontend (tab terminal mới)
cd ../frontend
cp .env.example .env
npm install
npm start
```

### **🗃️ Database (MongoDB Atlas)**

1. Tạo database trên [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Whitelist IP **`0.0.0.0`** (cho phép mọi kết nối)
3. Lấy connection string:

```bash
DB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dolciluxe?retryWrites=true&w=majority
```

## 🚀 Triển khai Production

### 🌐 Frontend (Vercel)

[](https://img.shields.io/badge/Deploy_on-Vercel-000000?logo=vercel&style=for-the-badge)

### **🔙 Backend (Render)**

[](https://img.shields.io/badge/Deploy_on-Render-46E3B7?logo=render&style=for-the-badge)

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng! Để đóng góp vào dự án:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/tinh-nang-moi`)
3. Commit các thay đổi (`git commit -am 'Thêm tính năng mới'`)
4. Push lên branch (`git push origin feature/tinh-nang-moi`)
5. Tạo Pull Request

## 📞 Liên hệ

- Email: [dolciluxevn@gmail.com](mailto:dolciluxevn@gmail.com)
- Website: [https://dolciluxe.vercel.app](https://dolciluxe.vercel.app)
- Địa chỉ: 123 Đường Bánh Ngọt, Quận 1, TP.HCM

---

© 2025 Dolciluxe. All rights reserved.