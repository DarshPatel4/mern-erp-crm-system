const mongoose = require('mongoose');
const Role = require('./models/Role');
const CompanyProfile = require('./models/CompanyProfile');
const EmailSmsConfig = require('./models/EmailSmsConfig');
const DocumentBranding = require('./models/DocumentBranding');
const NotificationPreferences = require('./models/NotificationPreferences');
const ThemeSettings = require('./models/ThemeSettings');
require('dotenv').config();

async function initializeSettingsData() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Initialize default roles
    const defaultRoles = [
      {
        name: 'Admin',
        description: 'Full system access and control',
        color: '#EF4444',
        permissions: {
          dashboard: 'Full Access',
          leads: 'Full Access',
          clients: 'Full Access',
          tasks: 'Full Access',
          invoices: 'Full Access',
          analytics: 'Full Access',
          settings: 'Full Access',
          employees: 'Full Access',
          attendance: 'Full Access',
          leaveTracker: 'Full Access',
          recruitment: 'Full Access',
          departments: 'Full Access'
        },
        isActive: true,
        userCount: 1
      },
      {
        name: 'HR',
        description: 'Human resources management',
        color: '#10B981',
        permissions: {
          dashboard: 'View Only',
          leads: 'No Access',
          clients: 'No Access',
          tasks: 'Full Access',
          invoices: 'No Access',
          analytics: 'View Only',
          settings: 'No Access',
          employees: 'Full Access',
          attendance: 'Full Access',
          leaveTracker: 'Full Access',
          recruitment: 'Full Access',
          departments: 'Full Access'
        },
        isActive: true,
        userCount: 1
      },
      {
        name: 'Sales',
        description: 'Sales and lead management',
        color: '#3B82F6',
        permissions: {
          dashboard: 'View Only',
          leads: 'Full Access',
          clients: 'Full Access',
          tasks: 'Full Access',
          invoices: 'Full Access',
          analytics: 'View Only',
          settings: 'No Access',
          employees: 'No Access',
          attendance: 'No Access',
          leaveTracker: 'No Access',
          recruitment: 'No Access',
          departments: 'No Access'
        },
        isActive: true,
        userCount: 0
      },
      {
        name: 'Employee',
        description: 'Basic employee access',
        color: '#8B5CF6',
        permissions: {
          dashboard: 'View Only',
          leads: 'No Access',
          clients: 'No Access',
          tasks: 'View Only',
          invoices: 'No Access',
          analytics: 'No Access',
          settings: 'No Access',
          employees: 'View Only',
          attendance: 'View Only',
          leaveTracker: 'View Only',
          recruitment: 'No Access',
          departments: 'No Access'
        },
        isActive: true,
        userCount: 0
      }
    ];

    // Check if roles already exist
    const existingRoles = await Role.find();
    if (existingRoles.length === 0) {
      await Role.insertMany(defaultRoles);
      console.log('Default roles created');
    } else {
      console.log('Roles already exist, skipping...');
    }

    // Initialize default company profile
    const existingCompanyProfile = await CompanyProfile.findOne();
    if (!existingCompanyProfile) {
      const defaultCompanyProfile = new CompanyProfile({
        name: 'Your Company Name',
        industry: 'Technology',
        foundedYear: new Date().getFullYear(),
        employeeCount: 0,
        description: 'Update your company description here',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        contact: {
          phone: '',
          email: '',
          website: ''
        },
        socialMedia: {
          linkedin: '',
          twitter: '',
          facebook: ''
        }
      });
      await defaultCompanyProfile.save();
      console.log('Default company profile created');
    } else {
      console.log('Company profile already exists, skipping...');
    }

    // Initialize default email/SMS config
    const existingEmailConfig = await EmailSmsConfig.findOne();
    if (!existingEmailConfig) {
      const defaultEmailConfig = new EmailSmsConfig({
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
        },
        isActive: true
      });
      await defaultEmailConfig.save();
      console.log('Default email/SMS config created');
    } else {
      console.log('Email/SMS config already exists, skipping...');
    }

    // Initialize default document branding
    const existingDocumentBranding = await DocumentBranding.findOne();
    if (!existingDocumentBranding) {
      const defaultDocumentBranding = new DocumentBranding({
        logos: {
          primary: '',
          secondary: '',
          favicon: ''
        },
        header: {
          showLogo: true,
          showCompanyName: true,
          showContactInfo: true,
          showSocialLinks: false
        },
        footer: {
          showLogo: true,
          showCompanyName: true,
          showContactInfo: true,
          showSocialLinks: false
        },
        documentSettings: {
          pageSize: 'A4',
          orientation: 'portrait',
          margins: 20,
          fontFamily: 'Arial',
          fontSize: 12,
          primaryColor: '#6366f1',
          secondaryColor: '#f3f4f6'
        }
      });
      await defaultDocumentBranding.save();
      console.log('Default document branding created');
    } else {
      console.log('Document branding already exists, skipping...');
    }

    // Initialize default notification preferences
    const existingNotificationPreferences = await NotificationPreferences.findOne();
    if (!existingNotificationPreferences) {
      const defaultNotificationPreferences = new NotificationPreferences({
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
      await defaultNotificationPreferences.save();
      console.log('Default notification preferences created');
    } else {
      console.log('Notification preferences already exist, skipping...');
    }

    // Initialize default theme settings
    const existingThemeSettings = await ThemeSettings.findOne();
    if (!existingThemeSettings) {
      const defaultThemeSettings = new ThemeSettings({
        mode: 'light',
        primaryColor: '#6366f1',
        secondaryColor: '#f3f4f6',
        accentColor: '#8b5cf6',
        fontSize: 14,
        interfaceDensity: 'comfortable',
        fontFamily: 'Inter',
        borderRadius: 8,
        shadows: true,
        animations: true
      });
      await defaultThemeSettings.save();
      console.log('Default theme settings created');
    } else {
      console.log('Theme settings already exist, skipping...');
    }

    console.log('Settings data initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing settings data:', error);
    process.exit(1);
  }
}

initializeSettingsData(); 