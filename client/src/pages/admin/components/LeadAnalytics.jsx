import { FaUserFriends, FaCheck, FaClock, FaExclamationTriangle, FaDollarSign } from 'react-icons/fa';
import { useDashboardData } from '../../../services/dashboard';

export default function LeadAnalytics() {
  const { data, loading } = useDashboardData();

  if (loading) {
    return <div className="bg-white rounded-2xl p-6 shadow mb-8 animate-pulse h-64" />;
  }

  const { leadStats } = data;

  // Calculate additional metrics
  const needsFollowUp = leadStats?.totalLeads - (leadStats?.convertedLeads + leadStats?.lostLeads);
  const avgLeadValue = leadStats?.totalLeads > 0 ? 
    (leadStats?.totalValue / leadStats?.totalLeads).toFixed(0) : 0;

  const leadMetrics = [
    {
      label: 'Total Leads',
      value: leadStats?.totalLeads || 0,
      icon: <FaUserFriends className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      label: 'Converted',
      value: leadStats?.convertedLeads || 0,
      icon: <FaCheck className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      label: 'In Progress',
      value: leadStats?.contactedLeads || 0,
      icon: <FaClock className="text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      label: 'High Priority',
      value: leadStats?.highPriorityLeads || 0,
      icon: <FaExclamationTriangle className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      label: 'Total Value',
      value: `$${(leadStats?.totalValue || 0).toLocaleString()}`,
      icon: <FaDollarSign className="text-purple-500" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      label: 'Avg. Value',
      value: `$${avgLeadValue}`,
      icon: <FaDollarSign className="text-indigo-500" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="font-semibold text-lg text-gray-800">Lead Analytics</div>
        <a href="/admin/leads" className="text-xs text-violet-600 font-semibold hover:underline">View All Leads</a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {leadMetrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${metric.bgColor} mb-3`}>
              {metric.icon}
            </div>
            <div className={`text-2xl font-bold ${metric.textColor} mb-1`}>
              {metric.value}
            </div>
            <div className="text-xs text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Conversion Rate Progress */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700">Conversion Rate</div>
          <div className="text-sm font-bold text-gray-900">
            {leadStats?.totalLeads > 0 ? 
              ((leadStats?.convertedLeads / leadStats?.totalLeads) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
            style={{ 
              width: `${leadStats?.totalLeads > 0 ? 
                (leadStats?.convertedLeads / leadStats?.totalLeads) * 100 : 0}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Goal: 25%</span>
          <span>{leadStats?.convertedLeads || 0} of {leadStats?.totalLeads || 0} converted</span>
        </div>
      </div>
    </div>
  );
} 