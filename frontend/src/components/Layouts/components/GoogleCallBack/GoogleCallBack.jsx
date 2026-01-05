// // components/AuthCallback.js
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { googleLoginUser } from '~/redux/apiRequest';

// export const GoogleCallBack = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get('token'); // JWT token
//     const refreshToken = params.get('refreshToken'); // Refresh token

//     if (token && refreshToken) {
//       //localStorage.setItem('authToken', token);
//       //localStorage.setItem('refreshToken', refreshToken);

//       googleLoginUser(dispatch, refreshToken, token);

//       navigate('/', { replace: true });
//     } else {
//       console.error('Not found Token');
//     }
//   }, [dispatch, navigate]);
// };

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess } from '~/redux/authSlice';
// import { logOutSuccess } from '~/redux/authSlice';
import { BE_BASE_URL } from '~/services/axios';

export const GoogleCallBack = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoogleUser = async () => {
      try {
        const res = await axios.get(`${BE_BASE_URL}/api/auth/google/success`, {
          withCredentials: true,
        });
        localStorage.setItem('login_type', 'google');
        // console.log('Google login response:', res);
        localStorage.removeItem('loggedOut');
        sessionStorage.removeItem('googleSynced');
        dispatch(loginSuccess(res.data.data)); // tùy backend trả về user ở đâu
        navigate('/'); // điều hướng đến hồ sơ
      } catch (err) {
        // dispatch(logOutSuccess());
        // console.error('Google login failed', err);
        navigate('/');
      }
    };

    fetchGoogleUser();
  }, [dispatch, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg font-medium">Đang đăng nhập bằng Google...</p>
    </div>
  );
};
