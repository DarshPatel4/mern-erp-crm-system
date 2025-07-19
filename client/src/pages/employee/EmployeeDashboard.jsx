import { logout } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="p-10 text-2xl">
      Employee Dashboard
      <div className="mt-4">
        <button onClick={handleLogout} className="bg-gray-400 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </div>
  );
} 