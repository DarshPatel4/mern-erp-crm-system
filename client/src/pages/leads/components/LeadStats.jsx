import { FaUsers, FaCheck, FaThumbsUp, FaExclamationTriangle } from 'react-icons/fa';

export default function LeadStats({ stats, loading }) {
  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: <FaUsers className="text-blue-500" size={24} />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Converted',
      value: stats.convertedLeads,
      icon: <FaCheck className="text-green-500" size={24} />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: <FaThumbsUp className="text-yellow-500" size={24} />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Needs Follow-up',
      value: stats.needsFollowUp,
      icon: <FaExclamationTriangle className="text-red-500" size={24} />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border p-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              {card.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {typeof card.value === 'number' && card.value.toLocaleString()}
                {typeof card.value === 'string' && card.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 