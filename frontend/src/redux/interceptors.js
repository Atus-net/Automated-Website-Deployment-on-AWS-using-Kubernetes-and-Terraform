import { response } from '~/services/axios';
import { jwtDecode } from 'jwt-decode';
import { refreshToken } from './apiRequest';
import axios from 'axios';


export const createInstance = (user, dispatch, stateAuth) => {
  const newInstance = response.create();

  newInstance.interceptors.request.use(
    async (config) => {
      const date = new Date();
      const decodedAccess = jwtDecode(user?.accessToken);

      if ((decodedAccess.exp - 60) < date.getTime() / 1000) {
        // Nếu access token sắp hết hạn
        const res = await refreshToken(user?.refreshToken);

        const refreshUser = {
          ...user, // Giữ lại refresh_token cũ
          accessToken: res.accessToken, // Cập nhật access_token mới
        };

        dispatch(stateAuth(refreshUser)); // Update vào store

        config.headers['Authorization'] = 'Bearer ' + res.accessToken;
      } else {
        // Nếu access_token còn hạn
        config.headers['Authorization'] = 'Bearer ' + user?.accessToken;
      }

      return config;
    },
    (err) => Promise.reject(err),
  );

  newInstance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      if (error.response) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
    },
  );

  return newInstance;
};
