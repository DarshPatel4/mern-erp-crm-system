import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import WelcomeBanner from './components/WelcomeBanner';
import AttendanceCard from './components/AttendanceCard';
import OverviewCards from './components/OverviewCards';
import RecentTasks from './components/RecentTasks';
import NotificationsPanel from './components/NotificationsPanel';
import AttendanceCalendar from './components/AttendanceCalendar';
import QuickActions from './components/QuickActions';
import {
  getDashboardSummary,
  getTasks,
  updateTaskStatus,
  getTodayAttendanceStatus,
  getMonthlyAttendanceSummary,
  checkIn,
  checkOut,
  startBreak,
  endBreak
} from '../../services/employeePortal';

const minutesToString = (minutes) => {
  if (!minutes && minutes !== 0) return '--';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
};

export default function DashboardHome() {
  const navigate = useNavigate();
  const {
    user,
    employeeId,
    notifications,
    markNotification,
    markAllNotifications,
    showToast
  } = useOutletContext();

  const [dashboardData, setDashboardData] = useState(null);
  const [attendanceState, setAttendanceState] = useState({
    isCheckedIn: false,
    workingHours: '--',
    status: 'not-started'
  });
  const [calendarState, setCalendarState] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    attendanceByDay: {}
  });
  const [tasks, setTasks] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);

  const loadSummary = useCallback(async () => {
    if (!employeeId) return;
    try {
      const data = await getDashboardSummary(employeeId);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard summary', error);
    }
  }, [employeeId]);

  const loadTasks = useCallback(async () => {
    if (!employeeId) return;
    try {
      const data = await getTasks(employeeId);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  }, [employeeId]);

  const loadTodayAttendance = useCallback(async () => {
    if (!employeeId) return;
    try {
      const data = await getTodayAttendanceStatus(employeeId);
      setAttendanceState({
        isCheckedIn: data.isCheckedIn,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        workingHours: minutesToString(data.workingHours),
        status: data.status?.toLowerCase() || 'not-started',
        statusLabel: data.status,
        breakStatus: data.breakStatus,
        onBreak: data.breakStatus === 'On Break',
        totalBreakTime: data.totalBreakTime,
        lastCheckIn: data.lastCheckIn
      });
    } catch (error) {
      console.error('Failed to load today attendance', error);
    }
  }, [employeeId]);

  const loadMonthlyAttendance = useCallback(async (year, month) => {
    if (!employeeId) return;
    try {
      const data = await getMonthlyAttendanceSummary(employeeId, { year, month });
      setCalendarState({
        month: data.month,
        year: data.year,
        attendanceByDay: data.calendarData || {}
      });
    } catch (error) {
      console.error('Failed to load monthly attendance', error);
    }
  }, [employeeId]);

  useEffect(() => {
    if (!employeeId) return;
    loadSummary();
    loadTasks();
    loadTodayAttendance();
    loadMonthlyAttendance(calendarState.year, calendarState.month);
  }, [employeeId, loadMonthlyAttendance, loadSummary, loadTasks, loadTodayAttendance]);

  const handleCheckIn = async () => {
    if (!employeeId) return;
    try {
      setLoadingAction(true);
      await checkIn(employeeId);
      await loadTodayAttendance();
      await loadSummary();
      showToast('success', 'Checked in successfully');
    } catch (error) {
      showToast('error', error.message || 'Failed to check in');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCheckOut = async () => {
    if (!employeeId) return;
    try {
      setLoadingAction(true);
      await checkOut(employeeId);
      await loadTodayAttendance();
      await loadSummary();
      showToast('success', 'Checked out successfully');
    } catch (error) {
      showToast('error', error.message || 'Failed to check out');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleStartBreak = async () => {
    if (!employeeId) return;
    try {
      setLoadingAction(true);
      await startBreak(employeeId);
      await loadTodayAttendance();
      showToast('success', 'Break started');
    } catch (error) {
      showToast('error', error.message || 'Failed to start break');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEndBreak = async () => {
    if (!employeeId) return;
    try {
      setLoadingAction(true);
      await endBreak(employeeId);
      await loadTodayAttendance();
      showToast('success', 'Break ended');
    } catch (error) {
      showToast('error', error.message || 'Failed to end break');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleTaskComplete = async (task) => {
    if (!task) return;
    try {
      await updateTaskStatus(task._id || task.id, 'completed');
      await loadTasks();
      await loadSummary();
      showToast('success', 'Task marked as completed');
    } catch (error) {
      showToast('error', error.message || 'Failed to update task');
    }
  };

  const handleMonthChange = (year, month) => {
    loadMonthlyAttendance(year, month);
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'leave':
        navigate('/employee/leave');
        break;
      case 'payroll':
        navigate('/employee/payroll');
        break;
      case 'profile':
        navigate('/employee/profile');
        break;
      case 'attendance':
        navigate('/employee/attendance');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <WelcomeBanner user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceCard
            attendanceData={attendanceState}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onStartBreak={handleStartBreak}
            onEndBreak={handleEndBreak}
            loadingAction={loadingAction}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-gray-600 mb-1">This Month</div>
            <div className="text-2xl font-bold text-gray-900">{dashboardData?.thisMonth?.days || 0} Days</div>
            <div className="flex items-center text-sm text-green-600">
              <span className="mr-1">✓</span>
              {dashboardData?.thisMonth?.status || 'Not Started'}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-gray-600 mb-1">Leave Balance</div>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardData?.leaveBalance
                ? Object.values(dashboardData.leaveBalance).reduce((total, value) => total + (value || 0), 0)
                : 0} Days
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <span className="mr-1">📅</span>
              Available
            </div>
          </div>
        </div>
      </div>

      <OverviewCards dashboardData={dashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <RecentTasks tasks={tasks} onComplete={handleTaskComplete} />
        </div>
        <div className="lg:col-span-1">
          <AttendanceCalendar
            month={calendarState.month}
            year={calendarState.year}
            attendanceByDay={calendarState.attendanceByDay}
            onChangeMonth={handleMonthChange}
          />
        </div>
        <div className="lg:col-span-1">
          <NotificationsPanel
            notifications={notifications}
            onMarkAllRead={() => {
              markAllNotifications?.();
            }}
            onMarkRead={(notification) => {
              markNotification?.(notification);
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <QuickActions onAction={handleQuickAction} />
        </div>
      </div>
    </div>
  );
}

