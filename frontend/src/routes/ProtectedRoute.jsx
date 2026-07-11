import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  if (!userInfo?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;