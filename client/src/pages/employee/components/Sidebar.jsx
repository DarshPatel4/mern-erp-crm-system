import { FaHome, FaClock, FaClipboardList, FaCalendarAlt, FaDollarSign, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: FaHome, path: '/employee', active: true },
    { name: 'Attendance', icon: FaClock, path: '/employee/attendance' },
    { name: 'Tasks', icon: FaClipboardList, path: '/employee/tasks' },
    { name: 'Leave Requests', icon: FaCalendarAlt, path: '/employee/leave' },
    { name: 'Payroll', icon: FaDollarSign, path: '/employee/payroll' },
    { name: 'Profile', icon: FaUser, path: '/employee/profile' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">NexusERP</div>
            <div className="text-sm text-gray-600">Employee Portal</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`} 
                  />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-700 font-semibold text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User Name'}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {user?.designation || 'Employee'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Logout"
          >
            <FaSignOutAlt size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
