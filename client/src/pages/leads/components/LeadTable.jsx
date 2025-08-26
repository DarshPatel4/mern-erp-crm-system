import { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function LeadTable({ 
  leads, 
  loading, 
  pagination, 
  filters, 
  sorting, 
  onEdit, 
  onDelete, 
  onPageChange, 
  onFilterChange, 
  onSortingChange 
}) {

  const getStatusBadge = (status) => {
    const statusConfig = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Converted': 'bg-green-100 text-green-800',
      'Lost': 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'Low': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-orange-100 text-orange-800',
      'High': 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[priority] || 'bg-gray-100 text-gray-800'}`;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSort = (column) => {
    const newSortOrder = sorting.sortBy === column && sorting.sortOrder === 'asc' ? 'desc' : 'asc';
    onSortingChange({ sortBy: column, sortOrder: newSortOrder });
  };



  const SortIcon = ({ column }) => {
    if (sorting.sortBy !== column) return <FaChevronDown className="text-gray-400" size={12} />;
    return sorting.sortOrder === 'asc' 
      ? <FaChevronUp className="text-gray-600" size={12} />
      : <FaChevronDown className="text-gray-600" size={12} />;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-12 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 lg:p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Leads</h2>
      </div>

             {/* Table */}
       <div className="overflow-x-auto">
         <table className="w-full min-w-full">
                     <thead className="bg-gray-50">
             <tr>
               <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <div className="flex items-center gap-2" onClick={() => handleSort('company')}>
                  Lead
                  <SortIcon column="company" />
                </div>
              </th>
                             <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                 <div className="flex items-center gap-2" onClick={() => handleSort('status')}>
                   Status
                   <SortIcon column="status" />
                 </div>
               </th>
               <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                 <div className="flex items-center gap-2" onClick={() => handleSort('priority')}>
                   Priority
                   <SortIcon column="priority" />
                 </div>
               </th>
               <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Assigned To
               </th>
               <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                 <div className="flex items-center gap-2" onClick={() => handleSort('lastContact')}>
                   <span className="hidden sm:inline">Last Contact</span>
                   <span className="sm:hidden">Last</span>
                   <SortIcon column="lastContact" />
                 </div>
               </th>
               <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Actions
               </th>
            </tr>
          </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
             {leads.map((lead) => (
               <tr key={lead._id} className="hover:bg-gray-50">
                 <td className="px-3 lg:px-6 py-4">
                                     <div className="flex items-center min-w-0">
                     <div className="flex-shrink-0 h-10 w-10">
                       <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                         <span className="text-sm font-medium text-purple-600">
                           {getInitials(lead.company)}
                         </span>
                       </div>
                     </div>
                     <div className="ml-4 min-w-0 flex-1">
                       <div className="text-sm font-medium text-gray-900 truncate">{lead.company}</div>
                       <div className="text-sm text-gray-500 truncate">{lead.email}</div>
                     </div>
                   </div>
                </td>
                                 <td className="px-3 lg:px-6 py-4">
                   <span className={getStatusBadge(lead.status)}>
                     {lead.status}
                   </span>
                 </td>
                 <td className="px-3 lg:px-6 py-4">
                   <span className={getPriorityBadge(lead.priority)}>
                     {lead.priority}
                   </span>
                 </td>
                 <td className="px-3 lg:px-6 py-4">
                   <div className="flex items-center">
                     <div className="flex-shrink-0 h-8 w-8">
                       <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                         <span className="text-xs font-medium text-blue-600">
                           {getInitials(lead.assignedTo?.name || 'Unknown')}
                         </span>
                       </div>
                     </div>
                     <div className="ml-3 min-w-0">
                       <div className="text-sm text-gray-900 truncate">{lead.assignedTo?.name || 'Unknown'}</div>
                     </div>
                   </div>
                 </td>
                 <td className="px-3 lg:px-6 py-4 text-sm text-gray-500">
                   <span className="hidden sm:inline">{formatDate(lead.lastContact)}</span>
                   <span className="sm:hidden">{new Date(lead.lastContact).toLocaleDateString()}</span>
                 </td>
                 <td className="px-3 lg:px-6 py-4 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(lead)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(lead._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

             {/* Pagination */}
       <div className="px-4 lg:px-6 py-4 border-t">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
           <div className="text-sm text-gray-700">
             <span className="hidden sm:inline">Showing {((pagination.current - 1) * pagination.limit) + 1} to {Math.min(pagination.current * pagination.limit, pagination.totalRecords)} of {pagination.totalRecords} results</span>
             <span className="sm:hidden">{pagination.totalRecords} results</span>
           </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={12} />
            </button>
            
                         {/* Page numbers */}
             <div className="flex items-center gap-1">
               {[...Array(pagination.total)].map((_, index) => {
                 const page = index + 1;
                 if (page === 1 || page === pagination.total || (page >= pagination.current - 1 && page <= pagination.current + 1)) {
                   return (
                     <button
                       key={page}
                       onClick={() => onPageChange(page)}
                       className={`px-2 py-1 text-sm rounded ${
                         page === pagination.current
                           ? 'bg-purple-600 text-white'
                           : 'text-gray-700 hover:bg-gray-100'
                       }`}
                     >
                       {page}
                     </button>
                   );
                 } else if (page === pagination.current - 2 || page === pagination.current + 2) {
                   return (
                     <span key={page} className="px-1 py-1 text-gray-500">...</span>
                   );
                 }
                 return null;
               })}
             </div>
            
            <button
              onClick={() => onPageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.total}
              className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 