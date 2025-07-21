import { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchEmployees } from '../../../services/employee';

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

export default function EmployeeDirectoryTable() {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const limit = 5;

  useEffect(() => {
    setLoading(true);
    fetchEmployees({
      page,
      limit,
      search,
      department: department === 'All' ? '' : department,
      status: status === 'All' ? '' : status,
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
  }, [page, search, department, status]);

  return (
    <div>
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
                    <button className="text-violet-600 hover:text-violet-800"><FaEye /></button>
                    <button className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
                    <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
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
    </div>
  );
} 