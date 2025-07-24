import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function RolesPermissions() {
  const [activeTab, setActiveTab] = useState('all-roles'); // 'all-roles', 'admin', 'hr', 'sales', 'employee'
  const [searchQuery, setSearchQuery] = useState('');
  const [showModuleFilter, setShowModuleFilter] = useState('All Modules');

  // Mock data for roles and permissions
  // In a real application, this would come from your backend API
  const [permissions, setPermissions] = useState([
    { module: 'Dashboard', admin: 'Full Access', hr: 'View Only', sales: 'View Only', employee: 'View Only' },
    { module: 'Leads', admin: 'Full Access', hr: 'No Access', sales: 'Full Access', employee: 'No Access' },
    { module: 'Clients', admin: 'Full Access', hr: 'View Only', sales: 'View Only', employee: 'No Access' },
    { module: 'Tasks', admin: 'Full Access', hr: 'Full Access', sales: 'Full Access', employee: 'View Only' },
    { module: 'Invoices', admin: 'Full Access', hr: 'No Access', sales: 'Full Access', employee: 'No Access' },
    { module: 'Analytics', admin: 'Full Access', hr: 'View Only', sales: 'View Only', employee: 'No Access' },
    { module: 'Settings', admin: 'Full Access', hr: 'No Access', sales: 'No Access', employee: 'No Access' },
    { module: 'Employees', admin: 'Full Access', hr: 'Full Access', sales: 'No Access', employee: 'View Only' },
    { module: 'Attendance', admin: 'Full Access', hr: 'Full Access', sales: 'No Access', employee: 'View Only' },
    { module: 'Leave Tracker', admin: 'Full Access', hr: 'Full Access', sales: 'No Access', employee: 'View Only' },
    { module: 'Recruitment', admin: 'Full Access', hr: 'Full Access', sales: 'No Access', employee: 'No Access' },
    { module: 'Departments', admin: 'Full Access', hr: 'Full Access', sales: 'No Access', employee: 'No Access' },
  ]);

  const roles = ['admin', 'hr', 'sales', 'employee'];
  const accessLevels = ['Full Access', 'View Only', 'No Access'];

  const handlePermissionChange = (moduleName, role, newPermission) => {
    setPermissions(prevPermissions =>
      prevPermissions.map(perm =>
        perm.module === moduleName ? { ...perm, [role]: newPermission } : perm
      )
    );
  };

  const filteredPermissions = permissions.filter(perm => {
    const matchesSearch = perm.module.toLowerCase().includes(searchQuery.toLowerCase());
    // In a real app, you might have a 'moduleType' field to filter by
    const matchesModuleFilter = showModuleFilter === 'All Modules' || perm.module.includes(showModuleFilter); // Simplified for mock

    if (activeTab === 'all-roles') {
      return matchesSearch && matchesModuleFilter;
    } else {
      // For specific role tabs, only show modules where that role has some access
      const roleAccess = perm[activeTab];
      return matchesSearch && matchesModuleFilter && roleAccess !== 'No Access';
    }
  });

  const handleAddRole = () => {
    alert('Add Role: This would open a modal to add a new role.');
  };

  const handleSaveChanges = () => {
    alert('Saving Changes: Permissions would be sent to the backend.');
    console.log('Updated Permissions:', permissions);
  };

  const handleCancelChanges = () => {
    alert('Changes Cancelled.');
    // In a real app, you would revert to the original fetched permissions
    // For this mock, we'll just log
    console.log('Changes cancelled.');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-gray-800">Roles & Permissions</div>
        <button
          className="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition"
          onClick={handleAddRole}
        >
          + Add Role
        </button>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'all-roles' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-violet-50'}`}
          onClick={() => setActiveTab('all-roles')}
        >
          All Roles
        </button>
        {roles.map(role => (
          <button
            key={role}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === role ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-violet-50'}`}
            onClick={() => setActiveTab(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search modules..."
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 text-sm bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 text-sm bg-gray-50"
            value={showModuleFilter}
            onChange={(e) => setShowModuleFilter(e.target.value)}
          >
            <option value="All Modules">All Modules</option>
            <option value="CRM">CRM</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="System">System</option>
          </select>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-500 text-xs uppercase">
              <th className="py-3 px-4 text-left font-semibold">Module</th>
              {roles.map(role => (
                <th key={role} className="py-3 px-4 text-left font-semibold">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPermissions.length === 0 ? (
              <tr>
                <td colSpan={roles.length + 1} className="text-center py-8 text-gray-500">No modules found matching your criteria.</td>
              </tr>
            ) : (
              filteredPermissions.map((perm, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800 font-medium">{perm.module}</td>
                  {roles.map(role => (
                    <td key={`${perm.module}-${role}`} className="py-3 px-4">
                      <select
                        className="w-full border rounded-lg px-2 py-1 text-xs focus:ring-violet-500 focus:border-violet-500 bg-white"
                        value={perm[role]}
                        onChange={(e) => handlePermissionChange(perm.module, role, e.target.value)}
                      >
                        {accessLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition"
          onClick={handleCancelChanges}
        >
          Cancel
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
