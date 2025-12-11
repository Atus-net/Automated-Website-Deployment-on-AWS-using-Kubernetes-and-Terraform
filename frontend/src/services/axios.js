import axios from 'axios';

const BE_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

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

        const res = await axios.post(`${BE_BASE_URL}/api/auth/refresh-token`, {
          refreshToken: refresh_token, // tên biến thống nhất
        });

        if (res.data.code === 200 && res.data.accessToken) {
          const newAccess = res.data.accessToken;

          // Lưu access_token mới
          localStorage.setItem('access_token', newAccess);

          // Gửi lại request cũ
          originalConfig.headers.Authorization = `Bearer ${newAccess}`;
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