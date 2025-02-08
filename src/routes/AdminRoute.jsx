// src/routes/AdminRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.email !== 'mihiradminleet123@gmail.com') {
    return <Navigate to="/protected" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
