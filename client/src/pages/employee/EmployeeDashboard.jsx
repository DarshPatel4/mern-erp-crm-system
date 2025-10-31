import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { logout, getCurrentUser } from '../../services/api';
import { getNotifications, markNotificationRead, getEmployeeProfile } from '../../services/employeePortal';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Toast Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[type] || 'bg-gray-500';

  return (
    <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] max-w-md`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  );
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setIsLoading(false); // Set loading to false immediately so page can render
    
    // Load data asynchronously (non-blocking)
    loadNotifications();
    loadUserProfile();
  }, [navigate]);

  const loadUserProfile = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser?._id && !currentUser?.id) {
        return;
      }
      
      const employeeId = currentUser._id || currentUser.id;
      const profile = await getEmployeeProfile(employeeId);
      // Merge profile data but keep original user data as fallback
      setUser(prev => {
        if (!prev) return prev; // Don't set if prev is null
        return { ...prev, ...profile };
      });
    } catch (error) {
      // Silently fail - use existing user data from localStorage
      // Only log if it's not a 404 (employee not found is expected for new employees)
      if (error.message && !error.message.includes('not found')) {
        console.error('Error loading user profile:', error);
      }
      // Don't update user state if API call fails
    }
  };

  const loadNotifications = useCallback(async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser?._id && !currentUser?.id) return;
      
      const employeeId = currentUser._id || currentUser.id;
      const data = await getNotifications(employeeId);
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  useEffect(() => {
    if (user?._id || user?.id) {
      loadNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, loadNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const markNotification = async (notification) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser?._id && !currentUser?.id) return;
      
      const employeeId = currentUser._id || currentUser.id;
      const notificationId = notification._id || notification.id;
      await markNotificationRead(employeeId, notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notification:', error);
    }
  };

  const markAllNotifications = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser?._id && !currentUser?.id) return;
      
      const employeeId = currentUser._id || currentUser.id;
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      await Promise.all(
        unreadNotifications.map(notif => {
          const notificationId = notif._id || notif.id;
          return markNotificationRead(employeeId, notificationId);
        })
      );
      
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all notifications:', error);
    }
  };

  const refreshProfile = async () => {
    await loadUserProfile();
  };

  if (!user || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const employeeId = user._id || user.id;
  const outletContext = {
    user,
    employeeId: employeeId || null, // Ensure employeeId is always defined (even if null)
    notifications,
    markNotification,
    markAllNotifications,
    showToast,
    refreshProfile
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          user={user} 
          notifications={notifications}
          onLogout={handleLogout}
          onMarkAllNotifications={markAllNotifications}
          onMarkNotification={markNotification}
        />
        
        {/* Main Content Area with Outlet */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet context={outletContext} />
        </main>
      </div>
      
      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
} 