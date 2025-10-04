import React from 'react';
import { FaTimes, FaEdit, FaTrash, FaUser, FaCalendar, FaFlag, FaCheckCircle } from 'react-icons/fa';

const TaskViewModal = ({ task, onClose, onEdit, onDelete }) => {
  if (!task) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'JD';
  };

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit Task"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Task"
            >
              <FaTrash className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              title="Close"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-gray-600 leading-relaxed">{task.description}</p>
          </div>

          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaFlag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Priority:</span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {/* Assigned To */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                {getInitials(task.assigned_to?.name)}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FaUser className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Assigned To:</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">{task.assigned_to?.name || 'Unknown'}</div>
              <div className="text-sm text-gray-600">{task.assigned_to?.designation || 'N/A'}</div>
              <div className="text-sm text-gray-500">{task.assigned_to?.department || 'N/A'}</div>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <FaCalendar className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm font-medium text-gray-700">Due Date</div>
              <div className="text-lg font-semibold text-gray-900">{formatDate(task.due_date)}</div>
            </div>
          </div>

          {/* Task Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Created</div>
              <div className="text-sm text-gray-600">
                {task.created_at ? formatDate(task.created_at) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Last Updated</div>
              <div className="text-sm text-gray-600">
                {task.updated_at ? formatDate(task.updated_at) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(task)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
          >
            <FaEdit />
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskViewModal;
