import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

/**
 * Guards routes that require authentication, and optionally a specific role.
 * - Not logged in        -> redirect to /login
 * - Logged in, wrong role -> redirect to their own dashboard
 */
const ROLE_HOME = {
  student: '/student',
  hr: '/hr',
  admin: '/admin',
};

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullPage />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
