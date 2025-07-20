import { useEffect, useState } from 'react';
import { fetchDashboardSummary } from '../../../services/dashboard';

const typeColors = {
  info: 'bg-blue-50 border-blue-200 text-blue-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  comment: 'bg-violet-50 border-violet-200 text-violet-700',
};

export default function QuickNotifications() {
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary().then(res => {
      setNotifications(res.notifications);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="bg-white rounded-2xl p-6 shadow mb-8 animate-pulse h-64" />;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-gray-800">Quick Notifications</div>
        <a href="#" className="text-xs text-violet-600 font-semibold hover:underline">View All</a>
      </div>
      <div className="flex flex-col gap-3">
        {notifications.map((n, i) => (
          <div key={i} className={`flex items-center gap-3 border-l-4 pl-3 py-2 rounded ${typeColors[n.type]}`}> 
            <div className="flex-1">
              <div className="font-medium text-sm">{n.message}</div>
              <div className="text-xs opacity-70">{n.detail} <span className="ml-2">{n.time}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 