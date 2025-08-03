import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createRole } from '../../../services/settings';

export default function AddRoleModal({ onClose }) {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [permissions, setPermissions] = useState({
    dashboard: { included: true, access: 'view-only' },
    leads: { included: true, access: 'limited-access' },
    clients: { included: true, access: 'view-only' },
    tasks: { included: true, access: 'view-only' },
    analytics: { included: false, access: 'no-access' },
    settings: { included: false, access: 'no-access' }
  });

  const modules = [
    { key: 'dashboard', name: 'Dashboard', icon: '🏠' },
    { key: 'leads', name: 'Leads', icon: '👥' },
    { key: 'clients', name: 'Clients', icon: '👥' },
    { key: 'tasks', name: 'Tasks', icon: '📋' },
    { key: 'analytics', name: 'Analytics', icon: '📊' },
    { key: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const accessLevels = [
    { value: 'full-access', label: 'Full Access' },
    { value: 'view-only', label: 'View Only' },
    { value: 'limited-access', label: 'Limited Access' },
    { value: 'no-access', label: 'No Access' }
  ];

  const colors = [
    { name: 'blue', value: '#3B82F6', bg: 'bg-blue-500' },
    { name: 'green', value: '#10B981', bg: 'bg-green-500' },
    { name: 'orange', value: '#F97316', bg: 'bg-orange-500' },
    { name: 'red', value: '#EF4444', bg: 'bg-red-500' },
    { name: 'yellow', value: '#EAB308', bg: 'bg-yellow-500' },
    { name: 'purple', value: '#8B5CF6', bg: 'bg-purple-500' },
    { name: 'pink', value: '#EC4899', bg: 'bg-pink-500' },
    { name: 'dark-blue', value: '#1E40AF', bg: 'bg-blue-700' },
    { name: 'grey', value: '#6B7280', bg: 'bg-gray-500' }
  ];

  const handlePermissionChange = (moduleKey, field, value) => {
    setPermissions(prev => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [field]: value
      }
    }));
  };

  const handleCreateRole = async () => {
    try {
      const selectedColorObj = colors.find(c => c.name === selectedColor);
      
      // Convert permissions to the format expected by the backend
      const permissionsData = {};
      Object.keys(permissions).forEach(moduleKey => {
        const permission = permissions[moduleKey];
        if (permission.included) {
          permissionsData[moduleKey] = permission.access.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        } else {
          permissionsData[moduleKey] = 'No Access';
        }
      });

      const roleData = {
        name: roleName,
        description: roleDescription,
        color: selectedColorObj?.value || '#6366f1',
        permissions: permissionsData
      };

      await createRole(roleData);
      onClose();
      // Optionally refresh the roles list in the parent component
      window.location.reload();
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Failed to create role. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Role Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Description
              </label>
              <textarea
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder="Enter role description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Module Permissions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Module Permissions</h3>
            <div className="space-y-3">
              {modules.map((module) => (
                <div key={module.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={permissions[module.key].included}
                      onChange={(e) => handlePermissionChange(module.key, 'included', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-lg">{module.icon}</span>
                    <span className="font-medium text-gray-900">{module.name}</span>
                  </div>
                  <select
                    value={permissions[module.key].access}
                    onChange={(e) => handlePermissionChange(module.key, 'access', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!permissions[module.key].included}
                  >
                    {accessLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Role Color */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Role Color</h3>
            <div className="flex gap-3 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-10 h-10 rounded-full ${color.bg} border-2 transition-all ${
                    selectedColor === color.name ? 'border-gray-900 scale-110' : 'border-white hover:scale-105'
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateRole}
            disabled={!roleName.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
} 