import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { applyLeave, getLeaves } from '../../services/employeePortal';

const statusBadgeMap = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const leaveTypes = [
  'Annual Leave',
  'Sick Leave',
  'Personal Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Bereavement Leave'
];

export default function Leave() {
  const { employeeId, showToast } = useOutletContext();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formState, setFormState] = useState({
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadLeaves = useCallback(async () => {
    if (!employeeId) return;
    try {
      const data = await getLeaves(employeeId);
      setLeaveRequests(data);
    } catch (error) {
      console.error('Failed to load leave requests', error);
    }
  }, [employeeId]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!employeeId) return;

    try {
      setIsSubmitting(true);
      await applyLeave({
        employeeId,
        leaveType: formState.leaveType,
        startDate: formState.startDate,
        endDate: formState.endDate,
        duration: 'Multiple Days',
        reason: formState.reason
      });
      setFormState({ leaveType: 'Annual Leave', startDate: '', endDate: '', reason: '' });
      await loadLeaves();
      showToast('success', 'Leave request submitted');
    } catch (error) {
      showToast('error', error.message || 'Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply for Leave</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                name="leaveType"
                value={formState.leaveType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                name="startDate"
                value={formState.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                name="endDate"
                value={formState.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                name="reason"
                value={formState.reason}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((leave) => (
                  <tr key={leave._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{leave.leaveType}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {leave.totalDays} day(s)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{leave.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadgeMap[leave.status] || 'bg-gray-100 text-gray-800'}`}>
                        {leave.status?.charAt(0).toUpperCase() + leave.status?.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {leaveRequests.length === 0 && (
            <div className="p-6 text-sm text-gray-500 text-center">No leave requests found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
