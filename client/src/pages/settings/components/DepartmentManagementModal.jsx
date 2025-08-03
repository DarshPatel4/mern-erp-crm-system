import { useState } from 'react';
import { FaTimes, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function DepartmentManagementModal({ onClose }) {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Engineering', description: 'Software development team', employeeCount: 15, color: 'blue' },
    { id: 2, name: 'Marketing', description: 'Digital marketing and branding', employeeCount: 8, color: 'green' },
    { id: 3, name: 'Sales', description: 'Sales and business development', employeeCount: 12, color: 'orange' },
    { id: 4, name: 'HR', description: 'Human resources and recruitment', employeeCount: 5, color: 'purple' }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue'
  });

  const colors = [
    { name: 'blue', value: '#3B82F6', bg: 'bg-blue-500' },
    { name: 'green', value: '#10B981', bg: 'bg-green-500' },
    { name: 'orange', value: '#F97316', bg: 'bg-orange-500' },
    { name: 'red', value: '#EF4444', bg: 'bg-red-500' },
    { name: 'purple', value: '#8B5CF6', bg: 'bg-purple-500' },
    { name: 'pink', value: '#EC4899', bg: 'bg-pink-500' },
    { name: 'yellow', value: '#EAB308', bg: 'bg-yellow-500' },
    { name: 'teal', value: '#14B8A6', bg: 'bg-teal-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDept) {
      setDepartments(prev => prev.map(dept => 
        dept.id === editingDept.id ? { ...dept, ...formData } : dept
      ));
      setEditingDept(null);
    } else {
      const newDept = {
        id: Date.now(),
        ...formData,
        employeeCount: 0
      };
      setDepartments(prev => [...prev, newDept]);
    }
    setFormData({ name: '', description: '', color: 'blue' });
    setShowAddForm(false);
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description, color: dept.color });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Department Management</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingDept(null);
                setFormData({ name: '', description: '', color: 'blue' });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              <FaPlus size={14} />
              Add Department
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingDept ? 'Edit Department' : 'Add New Department'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: color.name }))}
                          className={`w-8 h-8 rounded-full ${color.bg} border-2 ${
                            formData.color === color.name ? 'border-gray-900 scale-110' : 'border-white'
                          }`}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    {editingDept ? 'Update Department' : 'Add Department'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingDept(null);
                      setFormData({ name: '', description: '', color: 'blue' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Departments List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const color = colors.find(c => c.name === dept.color);
              return (
                <div key={dept.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${color?.bg}`}></div>
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {dept.employeeCount} employee{dept.employeeCount !== 1 ? 's' : ''}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color?.bg} text-white`}>
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 