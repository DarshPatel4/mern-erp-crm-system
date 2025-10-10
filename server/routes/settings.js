const express = require('express');
const router = express.Router();
const companyProfileController = require('../controllers/companyProfileController');
const emailSmsConfigController = require('../controllers/emailSmsConfigController');
const documentBrandingController = require('../controllers/documentBrandingController');
const notificationPreferencesController = require('../controllers/notificationPreferencesController');
const themeSettingsController = require('../controllers/themeSettingsController');
const backupController = require('../controllers/backupController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Company Profile routes
router.get('/company-profile', auth, roleCheck(['admin']), companyProfileController.getCompanyProfile);
router.put('/company-profile', auth, roleCheck(['admin']), companyProfileController.updateCompanyProfile);
router.post('/company-profile/logo', auth, roleCheck(['admin']), companyProfileController.uploadLogo);

// Email & SMS Config routes
router.get('/email-sms-config', auth, roleCheck(['admin']), emailSmsConfigController.getEmailSmsConfig);
router.put('/email-sms-config', auth, roleCheck(['admin']), emailSmsConfigController.updateEmailSmsConfig);
router.post('/email-sms-config/test-email', auth, roleCheck(['admin']), emailSmsConfigController.testEmail);
router.post('/email-sms-config/test-sms', auth, roleCheck(['admin']), emailSmsConfigController.testSms);

// Document Branding routes
router.get('/document-branding', auth, roleCheck(['admin']), documentBrandingController.getDocumentBranding);
router.put('/document-branding', auth, roleCheck(['admin']), documentBrandingController.updateDocumentBranding);
router.post('/document-branding/logo', auth, roleCheck(['admin']), documentBrandingController.uploadLogo);

// Notification Preferences routes
router.get('/notification-preferences', auth, roleCheck(['admin']), notificationPreferencesController.getNotificationPreferences);
router.put('/notification-preferences', auth, roleCheck(['admin']), notificationPreferencesController.updateNotificationPreferences);

// Theme Settings routes
router.get('/theme-settings', auth, roleCheck(['admin']), themeSettingsController.getThemeSettings);
router.put('/theme-settings', auth, roleCheck(['admin']), themeSettingsController.updateThemeSettings);
router.post('/theme-settings/reset', auth, roleCheck(['admin']), themeSettingsController.resetThemeSettings);

// Backup & Restore routes
router.post('/backup', auth, roleCheck(['admin']), backupController.createBackup);
router.get('/backup/list', auth, roleCheck(['admin']), backupController.listBackups);
router.get('/backup/download/:file', auth, roleCheck(['admin']), backupController.downloadBackup);
router.post('/backup/restore', auth, roleCheck(['admin']), backupController.restoreBackup);

module.exports = router; 