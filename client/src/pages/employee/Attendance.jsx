import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AttendanceCalendar from './components/AttendanceCalendar';
import {
  getAttendance,
  markAttendance,
  getMonthlyAttendanceSummary
} from '../../services/employeePortal';

export default function Attendance() {
  const { employeeId, showToast } = useOutletContext();
  const [attendance, setAttendance] = useState([]);
  const [calendarState, setCalendarState] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    attendanceByDay: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAttendance = useCallback(async () => {
    if (!employeeId) return;
    try {
      const data = await getAttendance(employeeId);
      setAttendance(data);
    } catch (error) {
      console.error('Failed to load attendance records', error);
    }
  }, [employeeId]);

  const loadCalendar = useCallback(async (year, month) => {
    if (!employeeId) return;
    try {
      const data = await getMonthlyAttendanceSummary(employeeId, { year, month });
      setCalendarState({
        month: data.month,
        year: data.year,
        attendanceByDay: data.calendarData || {}
      });
    } catch (error) {
      console.error('Failed to load calendar data', error);
    }
  }, [employeeId]);

  useEffect(() => {
    if (!employeeId) return;
    loadAttendance();
    loadCalendar(calendarState.year, calendarState.month);
  }, [employeeId, loadAttendance, loadCalendar]);

  const handleMarkAttendance = async () => {
    if (!employeeId) return;
    try {
      setIsSubmitting(true);
      await markAttendance(employeeId);
      await loadAttendance();
      await loadCalendar(calendarState.year, calendarState.month);
      showToast('success', 'Attendance marked for today');
    } catch (error) {
      showToast('error', error.message || 'Attendance already marked today');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'absent':
        return 'Absent';
      case 'leave':
        return 'Leave';
      case 'completed':
        return 'Checked Out';
      default:
        return status;
    }
  };

  const formatTime = (value) => {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date?.getTime())) return '--';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleMonthChange = (year, month) => {
    loadCalendar(year, month);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Attendance Tracker</h2>
          <p className="text-sm text-gray-600">Mark your daily attendance and review your history.</p>
        </div>
        <button
          onClick={handleMarkAttendance}
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
        >
          {isSubmitting ? 'Marking...' : 'Mark Attendance'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h3>
          <AttendanceCalendar
            month={calendarState.month}
            year={calendarState.year}
            attendanceByDay={calendarState.attendanceByDay}
            onChangeMonth={handleMonthChange}
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {attendance.map((entry) => (
              <div key={entry._id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      Check-in: {formatTime(entry.checkInTime)} • Check-out: {formatTime(entry.checkOutTime)}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    {formatStatus(entry.status)}
                  </span>
                </div>
              </div>
            ))}

            {attendance.length === 0 && (
              <div className="text-sm text-gray-500">No attendance records yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
