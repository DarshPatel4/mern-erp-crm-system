import { useState, useEffect } from 'react';
import { FaPlus, FaDownload, FaFilter, FaEye, FaEdit, FaTrash, FaUsers, FaCheck, FaThumbsUp, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import LeadStats from './components/LeadStats';
import LeadTable from './components/LeadTable';
import LeadModal from './components/LeadModal';
import { fetchLeadStats, fetchLeads, exportLeads, fetchEmployees } from '../../services/leadService';

export default function LeadManagement() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    needsFollowUp: 0
  });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    totalRecords: 0,
    limit: 5
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignedTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Load initial data
  useEffect(() => {
    loadData();
    loadEmployees();
  }, []);

  // Reload data when filters or pagination change
  useEffect(() => {
    loadData();
  }, [filters, pagination.current, sorting]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load stats and leads in parallel
      const [statsResponse, leadsResponse] = await Promise.all([
        fetchLeadStats(),
        fetchLeads({
          page: pagination.current,
          limit: pagination.limit,
          ...filters,
          ...sorting
        })
      ]);

      setStats(statsResponse);
      setLeads(leadsResponse.leads);
      setPagination(leadsResponse.pagination);
    } catch (error) {
      console.error('Error loading leads data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleCreateLead = () => {
    setEditingLead(null);
    setShowModal(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        // Call delete API
        await fetch(`http://localhost:5000/api/leads/${leadId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Reload data
        loadData();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingLead(null);
  };

  const handleModalSave = () => {
    setShowModal(false);
    setEditingLead(null);
    loadData(); // Reload data after save
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
  };

  const handleSortingChange = (newSorting) => {
    setSorting(newSorting);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await exportLeads(filters);
    } catch (error) {
      console.error('Error exporting leads:', error);
      alert('Failed to export leads. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      assignedTo: ''
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const hasActiveFilters = filters.search || filters.status || filters.priority || filters.assignedTo;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">Leads Overview</h1>
            <p className="text-gray-600 mt-1">Manage and track your sales leads</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <button
              onClick={handleCreateLead}
              className="flex items-center gap-2 px-3 py-2 lg:px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors text-sm lg:text-base"
            >
              <FaPlus size={12} className="lg:w-3.5 lg:h-3.5" />
              <span className="hidden sm:inline">Create Lead</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-3 py-2 lg:px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-sm lg:text-base"
            >
              <FaDownload size={12} className="lg:w-3.5 lg:h-3.5" />
              <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export'}</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 lg:px-4 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                hasActiveFilters 
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <FaFilter size={12} className="lg:w-3.5 lg:h-3.5" />
              <span className="hidden sm:inline">Filter {hasActiveFilters && '(Active)'}</span>
              <span className="sm:hidden">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <LeadStats stats={stats} loading={loading} />

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg border mt-6 lg:mt-8 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Leads</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <FaTimes size={12} />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                placeholder="Search by company or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange({ ...filters, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <select
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange({ ...filters, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-lg border mt-6 lg:mt-8">
        <LeadTable
          leads={leads}
          loading={loading}
          pagination={pagination}
          filters={filters}
          sorting={sorting}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
          onSortingChange={handleSortingChange}
        />
      </div>

      {/* Lead Modal */}
      {showModal && (
        <LeadModal
          lead={editingLead}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </main>
  );
} 