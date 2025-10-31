import { FaClock, FaCheckCircle, FaExclamationTriangle, FaEye } from 'react-icons/fa';

const statusIconMap = {
  completed: FaCheckCircle,
  'in-progress': FaClock,
  pending: FaClock,
  urgent: FaExclamationTriangle
};

const statusLabels = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  pending: 'Pending',
  urgent: 'Urgent'
};

const statusBadgeMap = {
  completed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  pending: 'bg-gray-100 text-gray-800',
  urgent: 'bg-red-100 text-red-800'
};

const iconColorMap = {
  completed: 'text-blue-600',
  'in-progress': 'text-yellow-600',
  pending: 'text-gray-500',
  urgent: 'text-red-600'
};

export default function RecentTasks({ tasks = [], onView, onComplete }) {
  const displayTasks = tasks.slice(0, 4);

  const getStatusBadge = (status) => {
    return statusBadgeMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDueDate = (value) => {
    if (!value) return 'No due date';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date?.getTime())) return value;
    return `Due: ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })}`;
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
        {displayTasks.map((task) => {
          const Icon = statusIconMap[task.status] || FaClock;
          const iconColor = iconColorMap[task.status] || 'text-gray-500';
          
          return (
            <div key={task._id || task.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${iconColor}`}>
                <Icon size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm mb-1 truncate">
                  {task.title}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDueDate(task.dueDate || task.due)}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                  {statusLabels[task.status] || task.status}
                </span>
                
                <button className="text-gray-400 hover:text-gray-600 p-1" onClick={() => onView?.(task)}>
                  <FaEye size={12} />
                </button>
                {task.status !== 'completed' && (
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1 text-xs"
                    onClick={() => onComplete?.(task)}
                  >
                    ✓
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {displayTasks.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-6">No tasks assigned yet.</div>
        )}
      </div>
    </div>
  );
}
