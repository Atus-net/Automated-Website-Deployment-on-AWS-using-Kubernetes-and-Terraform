import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { publicRoute, privateRoute } from './routes/route';
import DefaultLayout from './components/Layouts/DefaultLayout';
import PrivateRoute from './Middleware';
import { Fragment, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from './redux/authSlice';
import { BE_BASE_URL } from './services/axios';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const hasSynced = sessionStorage.getItem('googleSynced');
    const isLoggedOut = localStorage.getItem('loggedOut');
    const loginType = localStorage.getItem('login_type');

    if (loginType !== 'google' || hasSynced === 'true' || isLoggedOut === 'true') return;

    const syncGoogleUser = async () => {
      try {
        const res = await axios.get(`${BE_BASE_URL}/api/auth/google/success`, {
          withCredentials: true,
        });

        if (res.data?.data) {
          dispatch(loginSuccess(res.data.data));
          sessionStorage.setItem('googleSynced', 'true'); // ✅ chỉ sync 1 lần
        }
      } catch (err) {
        // Google session không tồn tại
      }
    };

    syncGoogleUser();
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          {publicRoute.map((route, index) => {
            const Layout = route.layout === null ? Fragment : DefaultLayout;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

          {/* Private Routes */}
          {privateRoute.map((route, index) => {
            const Layout = route.layout === null ? Fragment : route.layout;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <PrivateRoute>
                    <Layout>
                      <Page />
                    </Layout>
                  </PrivateRoute>
                }
              />
            );
          })}
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
