import { useEffect, useState } from 'react';
import { FaTimes, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
const API_URL = 'http://localhost:5000/api';

export default function DepartmentManagementModal({ onClose }) {
  const [departments, setDepartments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const colors = [
    { name: 'Blue', value: '#3B82F6', bg: 'bg-blue-500' },
    { name: 'Green', value: '#10B981', bg: 'bg-green-500' },
    { name: 'Orange', value: '#F97316', bg: 'bg-orange-500' },
    { name: 'Red', value: '#EF4444', bg: 'bg-red-500' },
    { name: 'Purple', value: '#8B5CF6', bg: 'bg-purple-500' },
    { name: 'Pink', value: '#EC4899', bg: 'bg-pink-500' },
    { name: 'Yellow', value: '#EAB308', bg: 'bg-yellow-500' },
    { name: 'Teal', value: '#14B8A6', bg: 'bg-teal-500' },
    { name: 'Gray', value: '#6B7280', bg: 'bg-gray-500' }
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/departments`, { headers: getAuthHeaders() });
      const data = await res.json();
      setDepartments(data);
    } catch (e) {
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingDept) {
        await fetch(`${API_URL}/departments/${editingDept._id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ name: formData.name, color: formData.color })
        });
        setEditingDept(null);
      } else {
        await fetch(`${API_URL}/departments`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ name: formData.name, color: formData.color })
        });
      }
      setFormData({ name: '', color: '#3B82F6' });
      setShowAddForm(false);
      await fetchDepartments();
    } catch (err) {
      setError('Failed to save department');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, color: dept.color || '#3B82F6' });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department? Employees will be reassigned to Unassigned.')) return;
    try {
      await fetch(`${API_URL}/departments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reassignTo: 'Unassigned' })
      });
      await fetchDepartments();
    } catch (e) {
      setError('Failed to delete department');
    }
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
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded">{error}</div>
          )}
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
                          key={color.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                          className={`w-8 h-8 rounded-full ${color.bg} border-2 ${
                            formData.color === color.value ? 'border-gray-900 scale-110' : 'border-white'
                          }`}
                          title={color.name}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingDept ? 'Update Department' : 'Add Department')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingDept(null);
                      setFormData({ name: '', color: '#3B82F6' });
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
            {loading ? (
              <div className="text-gray-500">Loading departments...</div>
            ) : (
            departments.map((dept) => {
              return (
                <div key={dept._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: dept.color }}></div>
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
                        onClick={() => handleDelete(dept._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {(dept.employeeCount || 0)} employee{(dept.employeeCount || 0) !== 1 ? 's' : ''}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Active</span>
                  </div>
                </div>
              );
            }))
            }
          </div>
        </div>
      </div>
    </div>
  );
} 