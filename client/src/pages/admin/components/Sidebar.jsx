import { FaHome, FaUserFriends, FaTasks, FaFileInvoice, FaChartBar, FaCog, FaQuestionCircle, FaUsers, FaProjectDiagram, FaBell } from 'react-icons/fa';
import { getCurrentUser } from '../../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <FaHome />, path: '/admin' },
  { label: 'Leads', icon: <FaUserFriends />, path: '/leads' },
  { label: 'Employees', icon: <FaUsers />, path: '/hr' },
  { label: 'Tasks', icon: <FaTasks />, path: '/tasks' },
  { label: 'Invoices', icon: <FaFileInvoice />, path: '/invoices' },
  { label: 'Analytics', icon: <FaChartBar />, section: 'REPORTS', path: '/analytics' },
  { label: 'Financial', icon: <FaChartBar />, section: 'REPORTS', path: '/financial' },
  { label: 'Settings', icon: <FaCog />, section: 'SETTINGS', path: '/settings' },
  { label: 'Help', icon: <FaQuestionCircle />, section: 'SETTINGS', path: '/help' },
];

export default function Sidebar() {
  const user = getCurrentUser();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'JD';
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <aside className="h-screen w-64 bg-white border-r flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="bg-violet-600 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold text-xl">N</div>
          <div>
            <div className="font-bold text-lg text-gray-800">NexusERP</div>
            <div className="text-xs text-gray-400">Enterprise Dashboard</div>
          </div>
        </div>
        <nav className="mt-6">
          <div className="text-xs text-gray-400 px-6 mb-2">MAIN</div>
          {navItems.filter(i => !i.section).map(item => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-6 py-2 cursor-pointer rounded-lg mb-1 ${location.pathname === item.path ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div className="text-xs text-gray-400 px-6 mt-6 mb-2">REPORTS</div>
          {navItems.filter(i => i.section === 'REPORTS').map(item => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-6 py-2 cursor-pointer rounded-lg mb-1 ${location.pathname === item.path ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div className="text-xs text-gray-400 px-6 mt-6 mb-2">SETTINGS</div>
          {navItems.filter(i => i.section === 'SETTINGS').map(item => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-6 py-2 cursor-pointer rounded-lg mb-1 ${location.pathname === item.path ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
      <div className="px-6 py-4 border-t flex items-center gap-3">
        <div className="bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">{initials}</div>
        <div>
          <div className="font-semibold text-sm">{user?.name || 'John Doe'}</div>
          <div className="text-xs text-gray-400">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Administrator'}</div>
        </div>
        <button className="ml-auto text-gray-400 hover:text-gray-700">
          <FaBell />
        </button>
      </div>
    </aside>
  );
} 