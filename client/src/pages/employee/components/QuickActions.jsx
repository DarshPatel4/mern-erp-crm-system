import { FaCalendar, FaDollarSign, FaUser, FaChartBar } from 'react-icons/fa';

export default function QuickActions({ onAction }) {
  const actions = [
    {
      id: 'leave',
      title: 'Apply for Leave',
      description: 'Submit a new leave request',
      icon: FaCalendar,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'payroll',
      title: 'View Payslip',
      description: 'Download salary statements',
      icon: FaDollarSign,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'profile',
      title: 'Update Profile',
      description: 'Edit personal information',
      icon: FaUser,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'attendance',
      title: 'Attendance Report',
      description: 'View detailed attendance',
      icon: FaChartBar,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="space-y-4">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={`w-full p-4 rounded-lg border ${action.bgColor} ${action.borderColor} hover:shadow-md transition-all duration-200 text-left group`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={action.iconColor} />
                </div>
                
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm mb-1">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {action.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
