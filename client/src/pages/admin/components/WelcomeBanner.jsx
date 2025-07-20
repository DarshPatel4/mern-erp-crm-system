import { useEffect, useState } from 'react';
import { FaUserFriends, FaDollarSign, FaTasks } from 'react-icons/fa';
import { fetchDashboardSummary } from '../../../services/dashboard';
import { getCurrentUser } from '../../../services/api';

export default function WelcomeBanner() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    fetchDashboardSummary().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-gradient-to-r from-violet-500 to-violet-400 text-white p-8 mb-8 flex flex-col gap-6 shadow-lg animate-pulse h-64" />
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-r from-violet-500 to-violet-400 text-white p-8 mb-8 flex flex-col gap-6 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-3xl font-bold mb-2">Welcome back, {user?.name || data?.welcome?.name || 'User'}!</div>
          <div className="text-lg opacity-90">Here's what's happening with your business today.</div>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <div className="text-base opacity-80">Today:</div>
          <div className="text-xl font-semibold">{data?.welcome?.today}</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {/* Card 1 */}
        <div className="flex-1 min-w-[220px] bg-white rounded-2xl flex flex-col items-center p-8 shadow-md">
          <div className="bg-violet-400 text-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
            <FaUserFriends className="text-2xl" />
          </div>
          <div className="text-lg font-medium text-gray-700 mb-1">Active Leads</div>
          <div className="text-3xl font-bold text-gray-900">{data?.kpis?.activeLeads}</div>
        </div>
        {/* Card 2 */}
        <div className="flex-1 min-w-[220px] bg-white rounded-2xl flex flex-col items-center p-8 shadow-md">
          <div className="bg-violet-400 text-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
            <FaDollarSign className="text-2xl" />
          </div>
          <div className="text-lg font-medium text-gray-700 mb-1">Monthly Revenue</div>
          <div className="text-3xl font-bold text-gray-900">${data?.kpis?.monthlyRevenue?.toLocaleString()}</div>
        </div>
        {/* Card 3 */}
        <div className="flex-1 min-w-[220px] bg-white rounded-2xl flex flex-col items-center p-8 shadow-md">
          <div className="bg-violet-400 text-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
            <FaTasks className="text-2xl" />
          </div>
          <div className="text-lg font-medium text-gray-700 mb-1">Tasks Due Today</div>
          <div className="text-3xl font-bold text-gray-900">{data?.kpis?.tasksDueToday}</div>
        </div>
      </div>
    </div>
  );
} 