import { FaBell } from 'react-icons/fa';
import { getCurrentUser, logout } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const user = getCurrentUser();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'JD';
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b">
      <div className="text-2xl font-semibold text-gray-800">Dashboard</div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-200 text-sm w-64"
        />
        <button className="relative text-gray-500 hover:text-violet-600">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">3</span>
        </button>
        <div
          className="relative flex items-center gap-2 cursor-pointer group"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="bg-gray-200 text-gray-700 rounded-full w-9 h-9 flex items-center justify-center font-bold">{initials}</div>
          <div className="text-sm font-medium text-gray-800">{user?.name || 'John Doe'}</div>
          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border z-50 p-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">{initials}</div>
                <div>
                  <div className="font-semibold text-gray-800">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-2">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Administrator'}</div>
              <button
                className="w-full py-2 mt-2 rounded-lg bg-violet-50 text-violet-700 font-semibold hover:bg-violet-100"
                onClick={handleLogout}
              >Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 