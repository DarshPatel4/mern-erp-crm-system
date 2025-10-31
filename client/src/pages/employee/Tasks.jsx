import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getTasks, updateTaskStatus } from '../../services/employeePortal';

const statusBadges = {
  pending: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  urgent: 'bg-red-100 text-red-800'
};

export default function Tasks() {
  const { employeeId, showToast } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!employeeId) return;
    try {
      const data = await getTasks(employeeId);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  }, [employeeId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleStatusChange = async (taskId, status) => {
    try {
      setIsUpdating(true);
      await updateTaskStatus(taskId, status);
      await loadTasks();
      showToast('success', 'Task updated');
    } catch (error) {
      showToast('error', error.message || 'Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    filter === 'all' ? true : task.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
          <p className="text-sm text-gray-600">Track your assigned work and update progress.</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-600">Status</label>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task._id || task.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-xs text-gray-500">{task.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{task.priority || 'medium'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadges[task.status] || statusBadges.pending}`}>
                      {task.status?.replace('-', ' ') || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <select
                      value={task.status}
                      disabled={isUpdating}
                      onChange={(event) => handleStatusChange(task._id || task.id, event.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="p-6 text-sm text-gray-500 text-center">No tasks found.</div>
        )}
      </div>
    </div>
  );
}
