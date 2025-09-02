import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../services/api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WelcomeBanner from './components/WelcomeBanner';
import AttendanceCard from './components/AttendanceCard';
import OverviewCards from './components/OverviewCards';
import RecentTasks from './components/RecentTasks';
import NotificationsPanel from './components/NotificationsPanel';
import AttendanceCalendar from './components/AttendanceCalendar';
import QuickActions from './components/QuickActions';
import LeaveModal from './components/LeaveModal';
import ProfileModal from './components/ProfileModal';
import PayrollModal from './components/PayrollModal';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    isCheckedIn: false,
    checkInTime: null,
    checkOutTime: null,
    workingHours: '0h 0m',
    lastCheckIn: null,
    status: 'Not Started'
  });
  const [dashboardData, setDashboardData] = useState({
    attendanceRate: 95.5,
    tasksCompleted: { completed: 8, total: 12 },
    performance: 4.8,
    leaveBalance: 12,
    thisMonth: { days: 22, status: 'Present' }
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const response = await fetch('/api/employee/dashboard', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      // setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      const now = new Date();
      setAttendanceData(prev => ({
        ...prev,
        isCheckedIn: true,
        checkInTime: now,
        lastCheckIn: now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        status: 'Working'
      }));
      // TODO: API call to record check-in
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const now = new Date();
      const checkIn = new Date(attendanceData.checkInTime);
      const hours = Math.floor((now - checkIn) / (1000 * 60 * 60));
      const minutes = Math.floor(((now - checkIn) % (1000 * 60 * 60)) / (1000 * 60));
      
      setAttendanceData(prev => ({
        ...prev,
        isCheckedIn: false,
        checkOutTime: now,
        workingHours: `${hours}h ${minutes}m`,
        status: 'Completed'
      }));
      // TODO: API call to record check-out
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header user={user} onLogout={handleLogout} />
        
        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Welcome Banner */}
          <WelcomeBanner user={user} />
          
          {/* Top Row - Attendance and Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Attendance Card - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <AttendanceCard 
                attendanceData={attendanceData}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
              />
            </div>
            
            {/* Right Side Summary Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow">
                <div className="text-sm text-gray-600 mb-1">This Month</div>
                <div className="text-2xl font-bold text-gray-900">{dashboardData.thisMonth.days} Days</div>
                <div className="flex items-center text-sm text-green-600">
                  <span className="mr-1">✓</span>
                  {dashboardData.thisMonth.status}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow">
                <div className="text-sm text-gray-600 mb-1">Leave Balance</div>
                <div className="text-2xl font-bold text-gray-900">{dashboardData.leaveBalance} Days</div>
                <div className="flex items-center text-sm text-blue-600">
                  <span className="mr-1">📅</span>
                  Available
                </div>
              </div>
            </div>
          </div>
          
          {/* Overview Cards Row */}
          <OverviewCards dashboardData={dashboardData} />
          
          {/* Bottom Row - Tasks, Calendar, Notifications, Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Recent Tasks */}
            <div className="lg:col-span-1">
              <RecentTasks />
            </div>
            
            {/* Attendance Calendar */}
            <div className="lg:col-span-1">
              <AttendanceCalendar />
            </div>
            
            {/* Notifications */}
            <div className="lg:col-span-1">
              <NotificationsPanel />
            </div>
            
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions onAction={openModal} />
            </div>
          </div>
        </main>
      </div>
      
      {/* Modals */}
      {activeModal === 'leave' && (
        <LeaveModal onClose={closeModal} />
      )}
      
      {activeModal === 'profile' && (
        <ProfileModal user={user} onClose={closeModal} />
      )}
      
      {activeModal === 'payroll' && (
        <PayrollModal onClose={closeModal} />
      )}
    </div>
  );
} 