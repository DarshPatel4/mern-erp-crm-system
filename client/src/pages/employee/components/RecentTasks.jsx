import { FaClock, FaCheckCircle, FaExclamationTriangle, FaEye } from 'react-icons/fa';

export default function RecentTasks() {
  const tasks = [
    {
      id: 1,
      title: 'Complete user authentication module',
      due: 'Today, 5:00 PM',
      status: 'Completed',
      priority: 'normal',
      icon: FaCheckCircle,
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Review API documentation',
      due: 'Tomorrow, 2:00 PM',
      status: 'In Progress',
      priority: 'normal',
      icon: FaClock,
      iconColor: 'text-yellow-600'
    },
    {
      id: 3,
      title: 'Fix database connection issues',
      due: 'Friday, 10:00 AM',
      status: 'Urgent',
      priority: 'high',
      icon: FaExclamationTriangle,
      iconColor: 'text-red-600'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
        <a href="/employee/tasks" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All
        </a>
      </div>
      
      <div className="space-y-4">
        {tasks.map((task) => {
          const Icon = task.icon;
          
          return (
            <div key={task.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${task.iconColor}`}>
                <Icon size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm mb-1 truncate">
                  {task.title}
                </div>
                <div className="text-xs text-gray-500">
                  Due: {task.due}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                  {task.status}
                </span>
                
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <FaEye size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
