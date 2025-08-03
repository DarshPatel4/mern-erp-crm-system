import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import AddRoleModal from './AddRoleModal';
import { fetchRoles, deleteRole } from '../../../services/settings';

export default function RolesPermissions({ onClose }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { key: 'all', label: 'All Roles' },
    { key: 'admin', label: 'Admin' },
    { key: 'hr', label: 'HR' },
    { key: 'sales', label: 'Sales' },
    { key: 'employee', label: 'Employee' }
  ];

  const modules = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Leads', icon: '👥' },
    { name: 'Clients', icon: '👥' },
    { name: 'Tasks', icon: '📋' }
  ];

  // Fetch roles from database
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const data = await fetchRoles();
        setRoles(data);
      } catch (err) {
        setError('Failed to load roles');
        console.error('Error loading roles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId);
        // Refresh roles list
        const updatedRoles = await fetchRoles();
        setRoles(updatedRoles);
      } catch (err) {
        setError('Failed to delete role');
        console.error('Error deleting role:', err);
      }
    }
  };

  const filteredRoles = roles.filter(role => 
    activeTab === 'all' || role.name.toLowerCase() === activeTab
  );

  const searchedRoles = filteredRoles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAccessLevelClass = (access) => {
    switch (access) {
      case 'Full Access':
        return 'bg-green-100 text-green-800';
      case 'View Only':
        return 'bg-blue-100 text-blue-800';
      case 'No Access':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Roles & Permissions</h2>
          <p className="text-gray-600 mt-1">Manage user roles and access controls</p>
        </div>
        <button
          onClick={() => setShowAddRoleModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          <FaPlus size={14} />
          Add Role
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4">
        <div className="flex space-x-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-500">Loading roles...</div>
        </div>
      )}

      {error && (
        <div className="px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        </div>
      )}

      {/* Roles List */}
      {!loading && !error && (
        <div className="px-6 pb-6">
          <div className="grid gap-4">
            {searchedRoles.map((role) => (
              <div key={role._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: role.color }}
                    ></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {role.userCount || 0} users
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {role.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1">
                      <FaEdit size={16} />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800 p-1"
                      onClick={() => handleDeleteRole(role._id)}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {searchedRoles.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No roles found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <AddRoleModal onClose={() => setShowAddRoleModal(false)} />
      )}
    </div>
  );
} 