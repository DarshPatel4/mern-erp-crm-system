import { useEffect, useState } from 'react';
import { fetchLeaves } from '../../../services/leave';

const statusColor = {
  'Approved': 'bg-green-100 text-green-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Rejected': 'bg-red-100 text-red-700',
};

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
}

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchLeaves()
      .then(res => {
        setLeaves(res);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load leave requests');
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-gray-800">Leave Management</div>
        <button className="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold text-sm">+ New Request</button>
      </div>
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No leave requests found.</div>
        ) : (
          leaves.map((leave, i) => (
            <div key={leave._id || i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white" style={{background: '#f3f4f6', color: '#6366f1'}}>{getInitials(leave.employee?.name || 'E')}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{leave.employee?.name || '-'}</div>
                <div className="text-xs text-gray-500">{leave.type}</div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span className="mr-1">📅</span>
                  {leave.startDate ? new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                  {leave.startDate !== leave.endDate && leave.endDate ? ` - ${new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                </div>
                {leave.approver?.name && (
                  <div className="text-xs text-gray-400">Approved by: {leave.approver.name}</div>
                )}
                {leave.status === 'Pending' && (
                  <div className="text-xs text-gray-400">Awaiting approval</div>
                )}
                {leave.status === 'Rejected' && leave.approver?.name && (
                  <div className="text-xs text-gray-400">Rejected by: {leave.approver.name}</div>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[leave.status]}`}>{leave.status}</div>
              <div className="text-xs text-gray-400 ml-2">{leave.days} {leave.days === 1 ? 'day' : 'days'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 