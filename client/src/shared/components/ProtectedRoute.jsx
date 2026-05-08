import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly = false, studentOnly = false }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Admin trying to access student-only routes
  if (studentOnly && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  // Student trying to access admin-only routes
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/student/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
