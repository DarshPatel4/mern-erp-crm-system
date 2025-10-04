import React, { useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const TaskKanban = ({ tasks, onStatusUpdate, onEdit, onView, onDelete }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: 'Pending', title: 'Pending', color: 'bg-gray-100 text-gray-800' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { id: 'Completed', title: 'Completed', color: 'bg-green-100 text-green-800' },
    { id: 'Overdue', title: 'Overdue', color: 'bg-red-100 text-red-800' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'JD';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      onStatusUpdate(draggedTask._id, status);
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const getTasksForColumn = (status) => {
    return tasks[status] || [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksForColumn(column.id);
        
        return (
          <div
            key={column.id}
            className="bg-gray-50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${column.color}`}>
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Task Cards */}
            <div className="space-y-3 min-h-[200px]">
              {columnTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FaPlus className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No tasks</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className="bg-white rounded-lg shadow-sm p-4 cursor-move hover:shadow-md transition-shadow"
                  >
                    {/* Task Title */}
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {task.title}
                    </h4>

                    {/* Task Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>

                    {/* Priority Badge */}
                    <div className="mb-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Assigned User */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                          {getInitials(task.assigned_to?.name)}
                        </div>
                        <span className="text-sm text-gray-700">
                          {task.assigned_to?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="text-xs text-gray-500 mb-3">
                      Due: {formatDate(task.due_date)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView(task)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Task"
                        >
                          <FaEye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onEdit(task)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit Task"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDelete(task)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Task"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskKanban;
