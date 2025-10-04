import React, { useState, useEffect } from 'react';
import { FaList, FaTh, FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFilter, FaSync } from 'react-icons/fa';
import { fetchTasks, fetchTasksForKanban, deleteTask, updateTaskStatus } from '../../services/taskService';
import { fetchEmployees } from '../../services/employee';
import TaskModal from './components/TaskModal';
import TaskViewModal from './components/TaskViewModal';
import TaskList from './components/TaskList';
import TaskKanban from './components/TaskKanban';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Sidebar from '../admin/components/Sidebar';
import Header from '../admin/components/Header';

export default function TaskManagement() {
  const [view, setView] = useState('list'); // 'list' or 'kanban'
  const [tasks, setTasks] = useState([]);
  const [kanbanTasks, setKanbanTasks] = useState({});
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assigned_to: ''
  });

  // Load employees for filters
  useEffect(() => {
    loadEmployees();
  }, []);

  // Load tasks on initial mount and when filters change
  useEffect(() => {
    loadTasks();
  }, [filters, pagination.current]);

  const loadEmployees = async () => {
    try {
      const response = await fetchEmployees({ page: 1, limit: 1000 });
      if (response.success) {
        setEmployees(response.data);
      } else if (response.employees) {
        // Handle different response structure
        setEmployees(response.employees);
      } else {
        console.error('Failed to load employees:', response);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      // Always load both list and kanban data to keep them in sync
      const [listResponse, kanbanResponse] = await Promise.all([
        fetchTasks({
          page: pagination.current,
          limit: 5,
          ...filters
        }),
        fetchTasksForKanban(filters)
      ]);

      if (listResponse && listResponse.success) {
        setTasks(listResponse.data || []);
        setPagination(listResponse.pagination || { current: 1, pages: 1, total: 0 });
      }

      if (kanbanResponse && kanbanResponse.success) {
        setKanbanTasks(kanbanResponse.data || {});
      }

      if ((listResponse && listResponse.success) || (kanbanResponse && kanbanResponse.success)) {
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Set empty data on error to prevent crashes
      setTasks([]);
      setKanbanTasks({});
      setPagination({ current: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setPagination({ current: 1, pages: 1, total: 0 });
    // No need to reload data since both views are always loaded
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination({ current: 1, pages: 1, total: 0 });
    // Data will be reloaded automatically by useEffect
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        const response = await deleteTask(taskToDelete._id);
        if (response.success) {
          loadTasks();
          setShowDeleteModal(false);
          setTaskToDelete(null);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleTaskUpdate = () => {
    loadTasks();
    setShowModal(false);
    setShowViewModal(false);
    setSelectedTask(null);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await updateTaskStatus(taskId, newStatus);
      if (response.success) {
        loadTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  return (
    <div className="flex bg-gray-50 min-h-screen h-screen">
      <div className="sticky top-0 left-0 h-screen z-30">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-h-screen h-screen">
        <div className="sticky top-0 z-20">
          <Header />
        </div>
        <div className="flex-1 p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all your tasks efficiently</p>
        </div>
        <div className="flex gap-3">
          {dataLoaded && (
            <button
              onClick={loadTasks}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaSync />
              Refresh
            </button>
          )}
          <button
            onClick={handleCreateTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            Create Task
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleViewChange('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              view === 'list' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaList />
            List View
          </button>
          <button
            onClick={() => handleViewChange('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              view === 'kanban' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaTh />
            Kanban View
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">All Users</label>
            <select
              value={filters.assigned_to}
              onChange={(e) => handleFilterChange('assigned_to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">All Statuses</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">All Priorities</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search tasks</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {view === 'list' ? (
            <TaskList
              tasks={tasks || []}
              pagination={pagination || { current: 1, pages: 1, total: 0 }}
              onPageChange={handlePageChange}
              onEdit={handleEditTask}
              onView={handleViewTask}
              onDelete={handleDeleteTask}
            />
          ) : (
            <TaskKanban
              tasks={kanbanTasks || {}}
              onStatusUpdate={handleStatusUpdate}
              onEdit={handleEditTask}
              onView={handleViewTask}
              onDelete={handleDeleteTask}
            />
          )}
        </>
      )}

      {/* Modals */}
      {showModal && (
        <TaskModal
          task={selectedTask}
          employees={employees}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          onSave={handleTaskUpdate}
        />
      )}

      {showViewModal && (
        <TaskViewModal
          task={selectedTask}
          onClose={() => {
            setShowViewModal(false);
            setSelectedTask(null);
          }}
          onEdit={(task) => {
            setShowViewModal(false);
            setSelectedTask(task);
            setShowModal(true);
          }}
          onDelete={(task) => {
            setShowViewModal(false);
            setTaskToDelete(task);
            setShowDeleteModal(true);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          task={taskToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setTaskToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
        </div>
      </div>
    </div>
  );
}
