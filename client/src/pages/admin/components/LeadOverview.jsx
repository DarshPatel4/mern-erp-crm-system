import { FaUserFriends, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useDashboardData } from '../../../services/dashboard';

export default function LeadOverview() {
  const { data, loading } = useDashboardData();
  const leadStats = data?.leadStats;

  if (loading) {
    return <div className="bg-white rounded-2xl p-6 shadow mb-8 animate-pulse h-44" />;
  }

  const stats = [
    {
      label: 'Total Leads',
      value: leadStats?.totalLeads || 0,
      icon: <FaUserFriends className="text-blue-500" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Converted',
      value: leadStats?.convertedLeads || 0,
      icon: <FaCheckCircle className="text-green-500" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'In Progress',
      value: (leadStats?.newLeads || 0) + (leadStats?.contactedLeads || 0),
      icon: <FaClock className="text-yellow-500" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'High Priority',
      value: leadStats?.highPriorityLeads || 0,
      icon: <FaExclamationTriangle className="text-red-500" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const conversionRate = leadStats?.totalLeads > 0 ? 
    ((leadStats.convertedLeads / leadStats.totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="font-semibold text-lg text-gray-800">Lead Overview</div>
        <div className="text-xs text-gray-500">
          Conversion Rate: <span className="font-bold text-green-600">{conversionRate}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            <span className="text-gray-600">Converted</span>
            <span className="font-semibold text-gray-900">{leadStats?.convertedLeads || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="text-gray-600">Lost</span>
            <span className="font-semibold text-gray-900">{leadStats?.lostLeads || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="text-gray-600">Active</span>
            <span className="font-semibold text-gray-900">{(leadStats?.newLeads || 0) + (leadStats?.contactedLeads || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 