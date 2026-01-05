import axios from 'axios';

// --- [ĐOẠN SỬA QUAN TRỌNG] ---
// Thay vì lấy từ biến môi trường (cứng), ta lấy động theo trình duyệt
// Ví dụ: Web chạy ở IP 1.2.3.4 thì Backend sẽ là http://1.2.3.4:8080
const BE_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8080`;

const response = axios.create({
  baseURL: BE_BASE_URL, 
  withCredentials: true,
});

// Interceptor REQUEST
response.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  const loginType = localStorage.getItem('login_type'); // "google" | "normal"
  // Chỉ gắn Authorization nếu login thường
  if (loginType !== 'google' && token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor RESPONSE (handle auto-refresh access_token)
response.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const originalConfig = err.config;

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (err.response?.status === 401 && !originalConfig._retry) {
      const isChangeRoleAPI = originalConfig.url?.includes('/users/role');
      if (isChangeRoleAPI) {
        return Promise.reject(err);
      }
      originalConfig._retry = true;
      const loginType = localStorage.getItem('login_type');

      // Nếu login bằng Google thì KHÔNG refresh token → logout
      if (loginType === 'google') {
        localStorage.clear();
        sessionStorage.removeItem('googleSynced');
        window.location.href = '/auth?mode=signin';
        return;
      }

      // Nếu login thường → thử refresh access_token
      try {
        const refresh_token = localStorage.getItem('refresh_token');

        // [CẬP NHẬT] Đảm bảo gọi đúng URL refresh token với BE_BASE_URL động
        const res = await axios.post(`${BE_BASE_URL}/api/auth/refresh-token`, {
          refreshToken: refresh_token, 
        });

        if (res.data.code === 200 && res.data.accessToken) {
          const newAccess = res.data.accessToken;

          // Lưu access_token mới
          localStorage.setItem('access_token', newAccess);

          // Gửi lại request cũ
          originalConfig.headers.Authorization = `Bearer ${newAccess}`;
          // [QUAN TRỌNG] Phải update lại baseURL cho request cũ nếu cần
          originalConfig.baseURL = BE_BASE_URL; 
          return response(originalConfig);
        } else {
          throw new Error('Refresh token không hợp lệ');
        }
      } catch (e) {
        localStorage.clear();
        sessionStorage.removeItem('googleSynced');
        window.location.href = '/auth?mode=signin';
      }
    }

    return Promise.reject(err);
  }
);

export { response, BE_BASE_URL };