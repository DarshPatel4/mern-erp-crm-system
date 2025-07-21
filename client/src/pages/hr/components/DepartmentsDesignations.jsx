import { useEffect, useState } from 'react';

export default function DepartmentsDesignations() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Departments */}
      <div className="bg-white rounded-2xl p-6 shadow flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg text-gray-800">Departments</div>
          <button className="px-2 py-1 rounded bg-violet-100 text-violet-700 text-xs font-semibold">+</button>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : departments.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No departments found.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {departments.map(dep => (
              <div key={dep._id} className={`flex items-center gap-3 rounded-lg px-4 py-2 ${dep.color}`}>
                <span className="font-semibold flex-1">{dep.name}</span>
                <span className="text-xs">{dep.employeeCount} employees</span>
                <button className="ml-auto text-gray-400 hover:text-gray-700">•••</button>
              </div>
            ))}
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
    </div>
  );
} 