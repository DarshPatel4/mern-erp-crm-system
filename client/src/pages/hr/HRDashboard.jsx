import { useState } from 'react';
import Sidebar from '../admin/components/Sidebar';
import Header from '../admin/components/Header';
import HRStats from './components/HRStats';
import EmployeeDirectoryTable from './components/EmployeeDirectoryTable';
import AttendanceCalendar from './components/AttendanceCalendar';
import LeaveManagement from './components/LeaveManagement';
import RecruitmentStatus from './components/RecruitmentStatus';
import DepartmentsDesignations from './components/DepartmentsDesignations';
import { FaPlus, FaDownload, FaFilter } from 'react-icons/fa';
import { createEmployee, fetchEmployees } from '../../services/employee';

const tabs = [
  { label: 'Employee Directory', value: 'directory' },
  { label: 'Attendance', value: 'attendance' },
  { label: 'Leave Tracker', value: 'leave' },
  { label: 'Recruitment', value: 'recruitment' },
  { label: 'Departments', value: 'departments' },
];

export default function HRDashboard() {
  const [tab, setTab] = useState('directory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', department: '', designation: '', hireDate: '', status: 'Active' });
  const [formError, setFormError] = useState('');
  const [refreshTable, setRefreshTable] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({ department: '', status: '', startDate: '', endDate: '' });

  const handleExportCSV = async () => {
    // Fetch all employees with current filters
    const res = await fetchEmployees({
      page: 1,
      limit: 1000, // large number to get all
      search: '',
      department: filters.department,
      status: filters.status,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
    const employees = res.employees || [];
    if (!employees.length) return alert('No employees to export.');
    // Convert to CSV
    const header = ['Name', 'Email', 'Department', 'Designation', 'Hire Date', 'Status'];
    const rows = employees.map(emp => [
      emp.name,
      emp.email,
      emp.department,
      emp.designation,
      emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('en-US') : '',
      emp.status
    ]);
    const csv = [header, ...rows].map(r => r.map(x => `"${x || ''}"`).join(',')).join('\n');
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFilterModal = () => {
    alert('Filter functionality not implemented yet.');
  };

  const handleAdd = async () => {
    setFormError('');
    if (!form.name || !form.email || !form.department || !form.designation) {
      setFormError('All fields are required');
      return;
    }
    const res = await createEmployee(form);
    if (res.error) { setFormError(res.error); return; }
    setShowAddModal(false);
    setForm({ name: '', email: '', department: '', designation: '', hireDate: '', status: 'Active' });
    setRefreshTable(r => !r);
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
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="text-2xl font-bold text-gray-800 mb-2">Employee Management</div>
          <div className="text-gray-500 mb-6">Manage your organization’s workforce</div>
          <HRStats />
          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map(t => (
              <button
                key={t.value}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === t.value ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-violet-50'}`}
                onClick={() => setTab(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow p-6 min-h-[400px]">
            {tab === 'directory' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    {/* Department and status filters can go here if needed */}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 text-white bg-violet-600 hover:bg-violet-700 font-semibold px-4 py-2 rounded-lg text-sm" onClick={() => setShowAddModal(true)}>
                      <FaPlus className="text-base" /> Add Employee
                    </button>
                    <button className="flex items-center gap-2 text-violet-700 border border-violet-600 hover:bg-violet-50 font-semibold px-4 py-2 rounded-lg text-sm" onClick={handleExportCSV}>
                      <FaDownload className="text-base" /> Export
                    </button>
                    <button className="flex items-center gap-2 text-violet-700 border border-violet-600 hover:bg-violet-50 font-semibold px-4 py-2 rounded-lg text-sm" onClick={() => setShowFilterModal(true)}>
                      <FaFilter className="text-base" /> Filter
                    </button>
                  </div>
                </div>
                <EmployeeDirectoryTable key={refreshTable} filters={filters} />
              </>
            )}
            {tab === 'attendance' && <AttendanceCalendar />}
            {tab === 'leave' && <LeaveManagement />}
            {tab === 'recruitment' && <RecruitmentStatus />}
            {tab === 'departments' && <DepartmentsDesignations />}
          </div>
          {/* Filter Modal */}
          {showFilterModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md" onClick={() => setShowFilterModal(false)}></div>
              <div className="relative z-10 w-full max-w-lg">
                <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
                  <button className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowFilterModal(false)}>&times;</button>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Filter Employees</h2>
                  <form onSubmit={e => { e.preventDefault(); setShowFilterModal(false); setRefreshTable(r => !r); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80" value={filters.department} onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}>
                        <option value="">All</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                        <option value="Support">Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                        <option value="">All</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date (From)</label>
                      <input type="date" className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80" value={filters.startDate} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date (To)</label>
                      <input type="date" className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80" value={filters.endDate} onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))} />
                    </div>
                    <div className="col-span-2 flex justify-end gap-4 mt-4">
                      <button type="button" className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200" onClick={() => setShowFilterModal(false)}>Cancel</button>
                      <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Apply Filters</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
          <div className="relative z-10 w-full max-w-2xl">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
              <button className="absolute top-6 right-8 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowAddModal(false)}>&times;</button>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Add New Employee</h2>
              <p className="text-gray-500 mb-8">Fill in the details to add a new employee to the system</p>
              <form onSubmit={e => { e.preventDefault(); handleAdd(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input type="email" className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
                  <select className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required>
                    <option value="">Select a department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation*</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date*</label>
                  <input type="date" className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80" value={form.hireDate} onChange={e => setForm({ ...form, hireDate: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                  <select className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} required>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                {formError && <div className="col-span-2 text-red-500 text-sm">{formError}</div>}
                <div className="col-span-2 flex justify-end gap-4 mt-4">
                  <button type="button" className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Add Employee</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
