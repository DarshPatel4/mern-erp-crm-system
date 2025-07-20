import { useEffect, useState } from 'react';
import { FaUserFriends, FaUsers, FaDollarSign, FaTasks } from 'react-icons/fa';
import { fetchDashboardSummary } from '../../../services/dashboard';

export default function KPICards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 animate-pulse h-44" />;
  }

  const kpis = data.kpis;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Total Leads */}
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold text-gray-700">Total Leads</div>
          <div className="bg-violet-100 p-2 rounded-full"><FaUserFriends className="text-violet-500 text-xl" /></div>
        </div>
        <div className="flex items-end gap-2">
          <div className="text-3xl font-bold text-gray-900">{kpis.totalLeads}</div>
          <div className="text-green-500 font-semibold flex items-center text-sm">↑ {kpis.leadsChange}%</div>
        </div>
        <div className="text-xs text-gray-500 mb-1">vs. previous month</div>
        <div className="w-full h-2 bg-violet-100 rounded-full mt-2">
          <div className="h-2 bg-violet-500 rounded-full" style={{ width: `${kpis.leadsAchieved}%` }}></div>
        </div>
        <div className="text-xs text-violet-500 mt-1">Target: {kpis.leadsTarget} <span className="text-gray-400 ml-2">{kpis.leadsAchieved}% achieved</span></div>
      </div>
      {/* Employee Count */}
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold text-gray-700">Employee Count</div>
          <div className="bg-blue-100 p-2 rounded-full"><FaUsers className="text-blue-500 text-xl" /></div>
        </div>
        <div className="flex items-end gap-2">
          <div className="text-3xl font-bold text-gray-900">{kpis.employeeCount}</div>
          <div className="text-green-500 font-semibold flex items-center text-sm">↑ {kpis.employeeChange}%</div>
        </div>
        <div className="text-xs text-gray-500 mb-1">vs. previous quarter</div>
        <div className="flex gap-2 mt-2 text-xs text-gray-500">
          <div>Departments: <span className="text-blue-500 font-bold">{kpis.departments}</span></div>
          <div>Avg. tenure: <span className="text-blue-500 font-bold">{kpis.avgTenure} yrs</span></div>
        </div>
      </div>
      {/* Revenue Stats */}
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold text-gray-700">Revenue Stats</div>
          <div className="bg-green-100 p-2 rounded-full"><FaDollarSign className="text-green-500 text-xl" /></div>
        </div>
        <div className="flex items-end gap-2">
          <div className="text-3xl font-bold text-gray-900">${kpis.revenue?.toLocaleString()}</div>
          <div className="text-green-500 font-semibold flex items-center text-sm">↑ {kpis.revenueChange}%</div>
        </div>
        <div className="text-xs text-gray-500 mb-1">vs. previous month</div>
        <div className="flex gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>Sales <span className="font-bold text-gray-700 ml-1">${kpis.sales?.toLocaleString()}</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>Services <span className="font-bold text-gray-700 ml-1">${kpis.services?.toLocaleString()}</span></div>
        </div>
      </div>
      {/* Ongoing Tasks */}
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold text-gray-700">Ongoing Tasks</div>
          <div className="bg-yellow-100 p-2 rounded-full"><FaTasks className="text-yellow-500 text-xl" /></div>
        </div>
        <div className="flex items-end gap-2">
          <div className="text-3xl font-bold text-gray-900">{kpis.ongoingTasks}</div>
          <div className="text-red-500 font-semibold flex items-center text-sm">↓ {Math.abs(kpis.tasksChange)}%</div>
        </div>
        <div className="text-xs text-gray-500 mb-1">vs. previous month</div>
        <div className="flex flex-col gap-1 mt-2 text-xs">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>Urgent <span className="font-bold text-gray-700 ml-1">{kpis.urgentTasks}</span></div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>High <span className="font-bold text-gray-700 ml-1">{kpis.highTasks}</span></div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>Normal <span className="font-bold text-gray-700 ml-1">{kpis.normalTasks}</span></div>
        </div>
      </div>
    </div>
  );
} 