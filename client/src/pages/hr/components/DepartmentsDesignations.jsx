import { useEffect, useState } from 'react';

const COLOR_OPTIONS = [
  { name: 'Blue', value: 'bg-blue-100 text-blue-800' },
  { name: 'Green', value: 'bg-green-100 text-green-800' },
  { name: 'Yellow', value: 'bg-yellow-100 text-yellow-800' },
  { name: 'Purple', value: 'bg-purple-100 text-purple-800' },
  { name: 'Pink', value: 'bg-pink-100 text-pink-800' },
  { name: 'Indigo', value: 'bg-indigo-100 text-indigo-800' },
  { name: 'Gray', value: 'bg-gray-100 text-gray-800' },
];

export default function DepartmentsDesignations() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', color: COLOR_OPTIONS[0].value });
  const [formError, setFormError] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchDepartments = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/departments', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load departments');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) {
      setFormError('Department name is required');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch('http://localhost:5000/api/departments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to add department');
        setAdding(false);
        return;
      }
      setShowAddModal(false);
      setForm({ name: '', color: COLOR_OPTIONS[0].value });
      fetchDepartments();
    } catch (err) {
      setFormError('Failed to add department');
    }
    setAdding(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Departments */}
      <div className="bg-white rounded-2xl p-6 shadow flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg text-gray-800">Departments</div>
          <button className="px-2 py-1 rounded bg-violet-100 text-violet-700 text-xs font-semibold" onClick={() => setShowAddModal(true)}>+</button>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : departments.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No departments found.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {departments.map(dep => {
              const bgColor = dep.color?.split(' ')[0] || 'bg-gray-100';
              const textColor = dep.color?.split(' ')[1] || 'text-gray-800';
              return (
                <div key={dep._id} className={`flex items-center gap-3 rounded-lg px-4 py-2 ${bgColor}`}> 
                  <span className={`font-semibold flex-1 ${textColor}`}>{dep.name}</span>
                  <span className={`text-xs ${textColor}`}>{dep.employeeCount} employees</span>
                  <button className="ml-auto text-gray-400 hover:text-gray-700">•••</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Designations (mock for now) */}
      <div className="bg-white rounded-2xl p-6 shadow flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg text-gray-800">Designations</div>
          <button className="px-2 py-1 rounded bg-violet-100 text-violet-700 text-xs font-semibold">+</button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-lg px-4 py-2 bg-gray-50">
            <span className="font-semibold flex-1">Software Engineer</span>
            <span className="text-xs text-gray-500">Engineering</span>
            <span className="text-xs">14 employees</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg px-4 py-2 bg-gray-50">
            <span className="font-semibold flex-1">Senior Developer</span>
            <span className="text-xs text-gray-500">Engineering</span>
            <span className="text-xs">8 employees</span>
          </div>
        </div>
      </div>
      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative z-10 w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
              <button className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowAddModal(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Add Department</h2>
              <form onSubmit={handleAddDepartment} className="flex flex-col gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLOR_OPTIONS.map(opt => (
                      <button
                        type="button"
                        key={opt.value}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${form.color === opt.value ? 'border-violet-600' : 'border-transparent'} ${opt.value}`}
                        onClick={() => setForm({ ...form, color: opt.value })}
                        aria-label={opt.name}
                      >
                        {form.color === opt.value && <span className="w-3 h-3 bg-violet-600 rounded-full"></span>}
                      </button>
                    ))}
                  </div>
                </div>
                {formError && <div className="text-red-500 text-sm">{formError}</div>}
                <div className="flex justify-end gap-4 mt-2">
                  <button type="button" className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700" disabled={adding}>{adding ? 'Adding...' : 'Add Department'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 