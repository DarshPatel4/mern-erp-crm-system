import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function NotificationsPanel() {
  const notifications = [
    {
      id: 1,
      title: 'New company policy update',
      description: 'Please review the updated remote work policy',
      time: '2 hours ago',
      type: 'info',
      icon: FaInfoCircle,
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Leave request approved',
      description: 'Your leave for Dec 25-26 has been approved',
      time: '1 day ago',
      type: 'success',
      icon: FaCheckCircle,
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      title: 'Timesheet reminder',
      description: 'Don\'t forget to submit your weekly timesheet',
      time: '2 days ago',
      type: 'warning',
      icon: FaExclamationTriangle,
      iconColor: 'text-yellow-600'
    }
  ];

  const getNotificationColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Mark all read
        </button>
      </div>
      
      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          
          return (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} hover:shadow-sm transition-all duration-200`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center ${notification.iconColor}`}>
                  <Icon size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm mb-1">
                    {notification.title}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {notification.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {notification.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
