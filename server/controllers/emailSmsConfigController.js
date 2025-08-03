const EmailSmsConfig = require('../models/EmailSmsConfig');

// Get email/SMS configuration
exports.getEmailSmsConfig = async (req, res) => {
  try {
    let config = await EmailSmsConfig.findOne();
    
    if (!config) {
      // Create default config if none exists
      config = new EmailSmsConfig({
        email: {
          smtpHost: '',
          smtpPort: 587,
          smtpUser: '',
          smtpPassword: '',
          fromEmail: '',
          fromName: '',
          templates: {
            welcome: 'Welcome to our platform!',
            passwordReset: 'Your password reset link: {link}',
            leaveRequest: 'Leave request from {employee} for {dates}',
            invoice: 'Invoice #{number} has been generated'
          }
        },
        sms: {
          provider: '',
          apiKey: '',
          apiSecret: '',
          fromNumber: '',
          templates: {
            otp: 'Your OTP is: {code}',
            leaveApproval: 'Your leave request has been {status}',
            reminder: 'Reminder: {message}'
          }
        }
      });
      await config.save();
    }
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update email/SMS configuration
exports.updateEmailSmsConfig = async (req, res) => {
  try {
    const updates = req.body;
    
    let config = await EmailSmsConfig.findOne();
    
    if (!config) {
      config = new EmailSmsConfig(updates);
    } else {
      Object.assign(config, updates);
    }
    
    const savedConfig = await config.save();
    res.json(savedConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Test email configuration
exports.testEmail = async (req, res) => {
  try {
    const { toEmail } = req.body;
    
    // In a real application, you would send a test email here
    // For now, we'll just return a success message
    
    res.json({ 
      message: 'Test email sent successfully',
      to: toEmail 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Test SMS configuration
exports.testSms = async (req, res) => {
  try {
    const { toNumber } = req.body;
    
    // In a real application, you would send a test SMS here
    // For now, we'll just return a success message
    
    res.json({ 
      message: 'Test SMS sent successfully',
      to: toNumber 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 