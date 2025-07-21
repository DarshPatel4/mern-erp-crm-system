import { useEffect, useState } from 'react';
import { fetchAttendance } from '../../../services/attendance';

const legend = [
  { label: 'Present', code: 'Present', color: 'bg-green-100 text-green-700' },
  { label: 'Absent', code: 'Absent', color: 'bg-red-100 text-red-700' },
  { label: 'Half Day', code: 'Half Day', color: 'bg-yellow-100 text-yellow-700' },
  { label: 'Leave', code: 'Leave', color: 'bg-blue-100 text-blue-700' },
  { label: 'Weekend', code: 'Weekend', color: 'bg-gray-100 text-gray-500' },
];

function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export default function AttendanceCalendar() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchAttendance({ month: `${year}-${month + 1}` })
      .then(res => {
        setAttendance(res);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load attendance');
        setLoading(false);
      });
  }, [month, year]);

  // Group attendance by employee
  const employees = {};
  attendance.forEach(a => {
    const emp = a.employee?.name || 'Unknown';
    if (!employees[emp]) employees[emp] = Array(getMonthDays(year, month)).fill('');
    const day = new Date(a.date).getDate() - 1;
    employees[emp][day] = a.status;
  });
  const days = Array.from({ length: getMonthDays(year, month) }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-gray-800">Attendance Tracking</div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => setMonth(m => m === 0 ? 11 : m - 1)} className="px-2 py-1 rounded hover:bg-gray-100">&#8592;</button>
          <span>{today.toLocaleString('default', { month: 'long' })} {year}</span>
          <button onClick={() => setMonth(m => m === 11 ? 0 : m + 1)} className="px-2 py-1 rounded hover:bg-gray-100">&#8594;</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : Object.keys(employees).length === 0 ? (
          <div className="text-center py-10 text-gray-400">No attendance records found.</div>
        ) : (
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                <th className="py-2 px-3 text-left"> </th>
                {days.map(day => (
                  <th key={day} className="py-2 px-3 text-center font-semibold">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(employees).map(([emp, att]) => (
                <tr key={emp}>
                  <td className="py-2 px-3 font-semibold text-gray-700">{emp}</td>
                  {att.map((code, i) => (
                    <td key={i} className={`py-2 px-3 text-center font-bold rounded ${legend.find(l => l.code === code)?.color}`}>{code ? code[0] : ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex gap-4 mt-4 text-xs">
        {legend.map(l => (
          <div key={l.code} className="flex items-center gap-1">
            <span className={`w-4 h-4 rounded ${l.color} inline-block`}></span> {l.label}
          </div>
        ))}
      </div>
    </div>
  );
} 