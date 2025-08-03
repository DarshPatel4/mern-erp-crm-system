import { useState } from 'react';
import { FaTimes, FaBell, FaEnvelope, FaMobile, FaDesktop } from 'react-icons/fa';

export default function NotificationPreferencesModal({ onClose }) {
  const [notifications, setNotifications] = useState({
    email: {
      enabled: true,
      newLeads: true,
      taskUpdates: true,
      invoiceReminders: true,
      systemAlerts: false,
      marketingUpdates: false
    },
    sms: {
      enabled: false,
      urgentAlerts: true,
      securityAlerts: true,
      systemMaintenance: false
    },
    push: {
      enabled: true,
      newLeads: true,
      taskUpdates: true,
      invoiceReminders: false,
      systemAlerts: true
    },
    inApp: {
      enabled: true,
      newLeads: true,
      taskUpdates: true,
      invoiceReminders: true,
      systemAlerts: true,
      teamUpdates: true
    }
  });

  const [userPreferences, setUserPreferences] = useState({
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    },
    frequency: 'immediate',
    digest: {
      enabled: true,
      frequency: 'daily',
      time: '09:00'
    }
  });

  const handleNotificationChange = (channel, type, value) => {
    setNotifications(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: value
      }
    }));
  };

  const handlePreferenceChange = (section, field, value) => {
    setUserPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Handle save logic
    console.log('Saving notification preferences:', { notifications, userPreferences });
    onClose();
  };

  const notificationTypes = {
    email: [
      { key: 'newLeads', label: 'New Leads', description: 'Get notified when new leads are added' },
      { key: 'taskUpdates', label: 'Task Updates', description: 'Receive updates on task status changes' },
      { key: 'invoiceReminders', label: 'Invoice Reminders', description: 'Get reminders for overdue invoices' },
      { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' },
      { key: 'marketingUpdates', label: 'Marketing Updates', description: 'News and marketing content' }
    ],
    sms: [
      { key: 'urgentAlerts', label: 'Urgent Alerts', description: 'Critical system notifications' },
      { key: 'securityAlerts', label: 'Security Alerts', description: 'Security-related notifications' },
      { key: 'systemMaintenance', label: 'System Maintenance', description: 'Scheduled maintenance updates' }
    ],
    push: [
      { key: 'newLeads', label: 'New Leads', description: 'Get notified when new leads are added' },
      { key: 'taskUpdates', label: 'Task Updates', description: 'Receive updates on task status changes' },
      { key: 'invoiceReminders', label: 'Invoice Reminders', description: 'Get reminders for overdue invoices' },
      { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' }
    ],
    inApp: [
      { key: 'newLeads', label: 'New Leads', description: 'Get notified when new leads are added' },
      { key: 'taskUpdates', label: 'Task Updates', description: 'Receive updates on task status changes' },
      { key: 'invoiceReminders', label: 'Invoice Reminders', description: 'Get reminders for overdue invoices' },
      { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' },
      { key: 'teamUpdates', label: 'Team Updates', description: 'Updates from team members' }
    ]
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Notification Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'email', icon: <FaEnvelope size={20} />, label: 'Email Notifications', color: 'text-blue-600' },
              { key: 'sms', icon: <FaMobile size={20} />, label: 'SMS Notifications', color: 'text-green-600' },
              { key: 'push', icon: <FaDesktop size={20} />, label: 'Push Notifications', color: 'text-purple-600' },
              { key: 'inApp', icon: <FaBell size={20} />, label: 'In-App Notifications', color: 'text-orange-600' }
            ].map((channel) => (
              <div key={channel.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={channel.color}>{channel.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">{channel.label}</h3>
                      <p className="text-sm text-gray-600">
                        {notifications[channel.key].enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[channel.key].enabled}
                      onChange={(e) => handleNotificationChange(channel.key, 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {notifications[channel.key].enabled && (
                  <div className="space-y-3">
                    {notificationTypes[channel.key].map((type) => (
                      <div key={type.key} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">{type.label}</span>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications[channel.key][type.key]}
                          onChange={(e) => handleNotificationChange(channel.key, type.key, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Preferences */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Preferences</h3>
            <div className="space-y-4">
              {/* Quiet Hours */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">Quiet Hours</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.quietHours.enabled}
                      onChange={(e) => handlePreferenceChange('quietHours', 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {userPreferences.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={userPreferences.quietHours.startTime}
                        onChange={(e) => handlePreferenceChange('quietHours', 'startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        value={userPreferences.quietHours.endTime}
                        onChange={(e) => handlePreferenceChange('quietHours', 'endTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Frequency</label>
                <select
                  value={userPreferences.frequency}
                  onChange={(e) => handlePreferenceChange('frequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              {/* Email Digest */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">Email Digest</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.digest.enabled}
                      onChange={(e) => handlePreferenceChange('digest', 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {userPreferences.digest.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                      <select
                        value={userPreferences.digest.frequency}
                        onChange={(e) => handlePreferenceChange('digest', 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={userPreferences.digest.time}
                        onChange={(e) => handlePreferenceChange('digest', 'time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
} 