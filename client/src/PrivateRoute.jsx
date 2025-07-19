import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from './services/api';

export default function PrivateRoute({ allowedRoles }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the correct dashboard for the user's role
    switch (user.role) {
      case 'admin': return <Navigate to="/admin" />;
      case 'hr': return <Navigate to="/hr" />;
      case 'sales': return <Navigate to="/sales" />;
      case 'employee': return <Navigate to="/employee" />;
      default: return <Navigate to="/login" />;
    }
  }
  return <Outlet />;
} 