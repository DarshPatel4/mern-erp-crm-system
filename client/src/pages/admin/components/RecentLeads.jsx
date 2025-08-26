import { FaUserFriends, FaEye } from 'react-icons/fa';
import { useDashboardData } from '../../../services/dashboard';

export default function RecentLeads() {
  const { data, loading } = useDashboardData();
  const recentLeads = data?.recentLeads || [];

  if (loading) {
    return <div className="bg-white rounded-2xl p-6 shadow mb-8 animate-pulse h-64" />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Converted': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (company) => {
    return company
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };



  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="font-semibold text-lg text-gray-800">Recent Leads</div>
        <a href="/admin/leads" className="text-xs text-violet-600 font-semibold hover:underline">View All</a>
      </div>
      
      <div className="space-y-3 lg:space-y-4">
        {recentLeads.map((lead) => (
          <div key={lead.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            {/* Left side - Lead info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-xs lg:text-sm font-medium text-violet-600">
                  {getInitials(lead.company)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 truncate text-sm lg:text-base">{lead.company}</div>
                <div className="text-xs lg:text-sm text-gray-500 truncate">{lead.email}</div>
              </div>
            </div>
            
            {/* Right side - Details and badges */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              {/* Value and date */}
              <div className="text-right sm:text-left">
                <div className="text-sm font-medium text-gray-900">${lead.value?.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{formatDate(lead.lastContact)}</div>
              </div>
              
              {/* Status and Priority badges */}
              <div className="flex flex-wrap gap-1 justify-end sm:justify-start">
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(lead.priority)}`}>
                  {lead.priority}
                </span>
              </div>
              
              {/* Action button */}
              <button className="text-violet-600 hover:text-violet-800 p-1 self-end sm:self-center">
                <FaEye size={12} className="lg:w-3.5 lg:h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 