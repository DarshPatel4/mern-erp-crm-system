import { useState } from 'react';
import { getAdminData, logout } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFetch = async () => {
    setError('');
    const res = await getAdminData();
    if (res.message) setData(res.message);
    else setError(res.error || 'Access denied');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-10 text-2xl">
      Admin Dashboard
      <div className="mt-4">
        <button onClick={handleFetch} className="bg-teal-500 text-white px-4 py-2 rounded mr-2">Fetch Admin Data</button>
        <button onClick={handleLogout} className="bg-gray-400 text-white px-4 py-2 rounded">Logout</button>
      </div>
      {data && <div className="mt-4 text-green-600">{data}</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
} 