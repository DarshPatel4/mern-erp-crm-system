import { useEffect, useState } from 'react';
import { FaUsers, FaUserCheck, FaCalendarAlt, FaBuilding, FaBirthdayCake, FaClipboardList } from 'react-icons/fa';

const icons = [
  <FaUsers className="text-blue-500 text-xl" />,
  <FaUserCheck className="text-green-500 text-xl" />,
  <FaCalendarAlt className="text-yellow-500 text-xl" />,
  <FaBuilding className="text-purple-500 text-xl" />,
  <FaBirthdayCake className="text-pink-500 text-xl" />,
  <FaClipboardList className="text-orange-500 text-xl" />
];

export default function HRStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/hr-stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load stats');
        setLoading(false);
      });
  }, []);

  const statList = stats ? [
    { label: 'Total Employees', value: stats.totalEmployees, icon: icons[0], bg: 'bg-blue-50' },
    { label: 'Active', value: stats.activeEmployees, icon: icons[1], bg: 'bg-green-50' },
    { label: 'On Leave', value: stats.onLeaveEmployees, icon: icons[2], bg: 'bg-yellow-50' },
    { label: 'Departments', value: stats.departments, icon: icons[3], bg: 'bg-purple-50' },
    { label: 'Upcoming Birthdays', value: stats.upcomingBirthdays, icon: icons[4], bg: 'bg-pink-50' },
    { label: 'Pending Leave Requests', value: stats.pendingLeaveRequests, icon: icons[5], bg: 'bg-orange-50' },
  ] : [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {loading ? (
        <div className="col-span-6 text-center py-10 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="col-span-6 text-center py-10 text-red-500">{error}</div>
      ) : statList.map((stat, i) => (
        <div key={stat.label} className={`rounded-2xl p-4 flex flex-col items-center shadow bg-white ${stat.bg}`}>
          <div className="mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
          <div className="text-xs text-gray-500 text-center mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
} 