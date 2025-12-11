import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  // const location = useLocation();
  const user = useSelector((state) => state.auth.login.currentUser);

  if (!user) {
    // const isAdminRoute = location.pathname.includes("/admin");
    return <Navigate to="/auth?mode=signin" />;
  }

  return children;
}

export default PrivateRoute;
