const NotificationPreferences = require('../models/NotificationPreferences');

// Get notification preferences
exports.getNotificationPreferences = async (req, res) => {
  try {
    let preferences = await NotificationPreferences.findOne();
    
    if (!preferences) {
      // Create default preferences if none exists
      preferences = new NotificationPreferences({
        email: {
          enabled: true,
          types: {
            newLead: true,
            leaveRequest: true,
            taskAssignment: true,
            invoiceGenerated: true,
            systemAlerts: true
          },
          frequency: 'immediate',
          quietHours: {
            enabled: false,
            startTime: '22:00',
            endTime: '08:00'
          }
        },
        sms: {
          enabled: false,
          types: {
            urgentAlerts: true,
            otpVerification: true,
            leaveApproval: false
          }
        },
        push: {
          enabled: true,
          types: {
            newLead: true,
            leaveRequest: true,
            taskAssignment: true,
            systemAlerts: true
          }
        },
        inApp: {
          enabled: true,
          types: {
            allNotifications: true,
            mentions: true,
            updates: true
          }
        }
      });
      await preferences.save();
    }
    
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update notification preferences
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const updates = req.body;
    
    let preferences = await NotificationPreferences.findOne();
    
    if (!preferences) {
      preferences = new NotificationPreferences(updates);
    } else {
      Object.assign(preferences, updates);
    }
    
    const savedPreferences = await preferences.save();
    res.json(savedPreferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 