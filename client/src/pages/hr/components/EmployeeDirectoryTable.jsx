import { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { fetchEmployees, createEmployee, getEmployeeById, updateEmployee, deleteEmployee } from '../../../services/employee';

const departments = ['All', 'Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Support'];
const statusList = ['All', 'Active', 'On Leave', 'Remote'];

const statusColor = {
  'Active': 'bg-green-100 text-green-700',
  'On Leave': 'bg-yellow-100 text-yellow-700',
  'Remote': 'bg-blue-100 text-blue-700',
};

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
}

export default function EmployeeDirectoryTable({ showAddButton, filters = {} }) {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', department: '', designation: '', hireDate: '', status: 'Active' });
  const [formError, setFormError] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const limit = 5;

  useEffect(() => {
    setLoading(true);
    fetchEmployees({
      page,
      limit,
      search,
      department: filters.department || (department === 'All' ? '' : department),
      status: filters.status || (status === 'All' ? '' : status),
      startDate: filters.startDate,
      endDate: filters.endDate,
    })
      .then(res => {
        setEmployees(res.employees || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
        setError(res.error || '');
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load employees');
        setLoading(false);
      });
  }, [page, search, department, status, filters]);

  // CRUD handlers
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
    setPage(1);
    // Refetch
    fetchEmployees({ page: 1, limit, search, department: department === 'All' ? '' : department, status: status === 'All' ? '' : status }).then(res => setEmployees(res.employees || []));
  };
  const handleView = async (id) => {
    const emp = await getEmployeeById(id);
    setSelectedEmployee(emp);
    setShowViewModal(true);
  };
  const handleEdit = async (id) => {
    const emp = await getEmployeeById(id);
    setForm({ ...emp, hireDate: emp.hireDate ? emp.hireDate.slice(0, 10) : '' });
    setSelectedEmployee(emp);
    setShowEditModal(true);
  };
  const handleUpdate = async () => {
    setFormError('');
    if (!form.name || !form.email || !form.department || !form.designation) {
      setFormError('All fields are required');
      return;
    }
    const res = await updateEmployee(selectedEmployee._id, form);
    if (res.error) { setFormError(res.error); return; }
    setShowEditModal(false);
    setSelectedEmployee(null);
    setPage(1);
    fetchEmployees({ page: 1, limit, search, department: department === 'All' ? '' : department, status: status === 'All' ? '' : status }).then(res => setEmployees(res.employees || []));
  };
  const handleDelete = async () => {
    await deleteEmployee(selectedEmployee._id);
    setShowDeleteModal(false);
    setSelectedEmployee(null);
    setPage(1);
    fetchEmployees({ page: 1, limit, search, department: department === 'All' ? '' : department, status: status === 'All' ? '' : status }).then(res => setEmployees(res.employees || []));
  };

  // Checkbox handlers
  const isAllSelected = employees.length > 0 && selectedRows.length === employees.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < employees.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(employees.map(emp => emp._id));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  return (
    <div>
      {showAddButton && (
        <button className="flex items-center gap-2 text-violet-700 font-semibold text-lg hover:underline ml-auto mb-4" onClick={() => setShowAddModal(true)}>
          <FaPlus className="text-base" /> Add Employee
        </button>
      )}
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          className="px-4 py-2 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-200 text-sm w-full md:w-64"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
          {departments.map(dep => (
            <button
              key={dep}
              className={`px-3 py-1 rounded text-xs font-semibold ${department === dep ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-violet-50'}`}
              onClick={() => { setDepartment(dep); setPage(1); }}
            >
              {dep}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
          {statusList.map(st => (
            <button
              key={st}
              className={`px-3 py-1 rounded text-xs font-semibold ${status === st ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-violet-50'}`}
              onClick={() => { setStatus(st); setPage(1); }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : employees.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No employees found.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase border-b">
                <th className="py-2 px-3 text-left">
                  <input
                    type="checkbox"
                    className="accent-violet-500 w-4 h-4 rounded border-gray-300"
                    checked={isAllSelected}
                    ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-2 px-3 text-left">Employee</th>
                <th className="py-2 px-3 text-left">Department</th>
                <th className="py-2 px-3 text-left">Email</th>
                <th className="py-2 px-3 text-left">Designation</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-left">Join Date</th>
                <th className="py-2 px-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      className="accent-violet-500 w-4 h-4 rounded border-gray-300"
                      checked={selectedRows.includes(emp._id)}
                      onChange={() => handleSelectRow(emp._id)}
                    />
                  </td>
                  <td className="py-3 px-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{background: '#f3f4f6', color: '#6366f1'}}>{getInitials(emp.name)}</div>
                    <div className="font-semibold text-gray-800">{emp.name}</div>
                  </td>
                  <td className="py-3 px-3">{emp.department}</td>
                  <td className="py-3 px-3">{emp.email || '-'}</td>
                  <td className="py-3 px-3">{emp.designation || '-'}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor[emp.status] || 'bg-gray-100 text-gray-500'}`}>{emp.status || '-'}</span>
                  </td>
                  <td className="py-3 px-3">{emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</td>
                  <td className="py-3 px-3 flex gap-2">
                    <button className="text-violet-600 hover:text-violet-800" onClick={() => handleView(emp._id)}><FaEye /></button>
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(emp._id)}><FaEdit /></button>
                    <button className="text-red-500 hover:text-red-700" onClick={() => { setSelectedEmployee(emp); setShowDeleteModal(true); }}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs text-gray-500">Showing {employees.length ? (page - 1) * limit + 1 : 0} to {(page - 1) * limit + employees.length} of {total} results</div>
        <div className="flex gap-1">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-2 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50">Prev</button>
          {[...Array(pages)].map((_, i) => (
            <button
              key={i + 1}
              className={`px-2 py-1 rounded ${page === i + 1 ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={page === pages} onClick={() => setPage(page + 1)} className="px-2 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 border w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Employee</h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setShowAddModal(false)}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
                  <div className="grid gap-4">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
                      <select id="department" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
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
                      <label htmlFor="designation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Designation</label>
                      <input type="text" name="designation" id="designation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter designation" required value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="hireDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hire Date</label>
                      <input type="date" name="hireDate" id="hireDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                      <select id="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    {formError && <p className="text-red-500 text-sm">{formError}</p>}
                    <button type="submit" className="w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800">Add Employee</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md" onClick={() => setShowViewModal(false)}></div>
          <div className="relative z-10 w-full max-w-2xl">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
              <button className="absolute top-6 right-8 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowViewModal(false)}>&times;</button>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Employee Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Name</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedEmployee.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedEmployee.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Department</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedEmployee.department}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Designation</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedEmployee.designation}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Hire Date</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedEmployee.hireDate ? new Date(selectedEmployee.hireDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedEmployee.status}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md" onClick={() => setShowEditModal(false)}></div>
          <div className="relative z-10 w-full max-w-2xl">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
              <button className="absolute top-6 right-8 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowEditModal(false)}>&times;</button>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Edit Employee</h2>
              <form onSubmit={e => { e.preventDefault(); handleUpdate(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                  <button type="button" className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Update Employee</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Employee Modal */}
      {showDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative z-10 w-full max-w-md">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl p-10 flex flex-col items-center">
              <button className="absolute top-6 right-8 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowDeleteModal(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Delete Employee</h2>
              <p className="text-gray-700 mb-8 text-center">Are you sure you want to delete employee <span className="font-semibold">"{selectedEmployee.name}"</span>? This action cannot be undone.</p>
              <div className="flex justify-center gap-4 mt-4">
                <button type="button" className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button type="button" className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 