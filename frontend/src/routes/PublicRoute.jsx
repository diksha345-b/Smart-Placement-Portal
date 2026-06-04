import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const ROLE_HOME = {
  student: '/student',
  hr: '/hr',
  admin: '/admin',
};

/**
 * For auth pages (login/register): if already logged in, send users to their
 * dashboard instead of showing the form again.
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullPage />;
  if (user) return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
  return children;
};

export default PublicRoute;
