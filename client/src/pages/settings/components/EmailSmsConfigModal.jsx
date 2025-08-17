import { useState } from 'react';
import { FaTimes, FaEnvelope, FaSms, FaKey, FaCog } from 'react-icons/fa';

export default function EmailSmsConfigModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('email');
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    username: 'erpcrm@gmail.com',
    password: '',
    fromName: 'NexusERP',
    fromEmail: 'darshpatel2531@gmail.com',
    encryption: 'tls'
  });

  const [smsConfig, setSmsConfig] = useState({
    provider: 'twilio',
    accountSid: '',
    authToken: '',
    fromNumber: '+919979099218',
    apiKey: ''
  });

  const [templates, setTemplates] = useState({
    welcome: {
      subject: 'Welcome to NexusERP',
      body: 'Dear {{name}},\n\nWelcome to NexusERP! We\'re excited to have you on board.\n\nBest regards,\nThe NexusERP Team'
    },
    passwordReset: {
      subject: 'Password Reset Request',
      body: 'Dear {{name}},\n\nYou requested a password reset. Click the link below to reset your password:\n\n{{resetLink}}\n\nIf you didn\'t request this, please ignore this email.\n\nBest regards,\nThe NexusERP Team'
    },
    invoice: {
      subject: 'Invoice #{{invoiceNumber}}',
      body: 'Dear {{customerName}},\n\nPlease find attached invoice #{{invoiceNumber}} for {{amount}}.\n\nDue date: {{dueDate}}\n\nThank you for your business.\n\nBest regards,\n{{companyName}}'
    }
  });

  const handleEmailConfigChange = (field, value) => {
    setEmailConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSmsConfigChange = (field, value) => {
    setSmsConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateChange = (template, field, value) => {
    setTemplates(prev => ({
      ...prev,
      [template]: { ...prev[template], [field]: value }
    }));
  };

  const handleTestEmail = () => {
    // Handle test email logic
    console.log('Testing email configuration:', emailConfig);
  };

  const handleTestSms = () => {
    // Handle test SMS logic
    console.log('Testing SMS configuration:', smsConfig);
  };

  const handleSave = () => {
    // Handle save logic
    console.log('Saving configurations:', { emailConfig, smsConfig, templates });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Email & SMS Configuration</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'email'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaEnvelope size={16} />
              Email Settings
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'sms'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaSms size={16} />
              SMS Settings
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'templates'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaCog size={16} />
              Templates
            </button>
          </div>

          {/* Email Configuration */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={emailConfig.smtpHost}
                    onChange={(e) => handleEmailConfigChange('smtpHost', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <input
                    type="number"
                    value={emailConfig.smtpPort}
                    onChange={(e) => handleEmailConfigChange('smtpPort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="email"
                    value={emailConfig.username}
                    onChange={(e) => handleEmailConfigChange('username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={emailConfig.password}
                    onChange={(e) => handleEmailConfigChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                  <input
                    type="text"
                    value={emailConfig.fromName}
                    onChange={(e) => handleEmailConfigChange('fromName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                  <input
                    type="email"
                    value={emailConfig.fromEmail}
                    onChange={(e) => handleEmailConfigChange('fromEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
                  <select
                    value={emailConfig.encryption}
                    onChange={(e) => handleEmailConfigChange('encryption', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleTestEmail}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  Test Email
                </button>
              </div>
            </div>
          )}

          {/* SMS Configuration */}
          {activeTab === 'sms' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMS Provider</label>
                  <select
                    value={smsConfig.provider}
                    onChange={(e) => handleSmsConfigChange('provider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="twilio">Twilio</option>
                    <option value="aws-sns">AWS SNS</option>
                    <option value="nexmo">Nexmo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account SID</label>
                  <input
                    type="text"
                    value={smsConfig.accountSid}
                    onChange={(e) => handleSmsConfigChange('accountSid', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auth Token</label>
                  <input
                    type="password"
                    value={smsConfig.authToken}
                    onChange={(e) => handleSmsConfigChange('authToken', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Number</label>
                  <input
                    type="tel"
                    value={smsConfig.fromNumber}
                    onChange={(e) => handleSmsConfigChange('fromNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <input
                    type="password"
                    value={smsConfig.apiKey}
                    onChange={(e) => handleSmsConfigChange('apiKey', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleTestSms}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  Test SMS
                </button>
              </div>
            </div>
          )}

          {/* Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              {Object.entries(templates).map(([key, template]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()} Template
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={template.subject}
                        onChange={(e) => handleTemplateChange(key, 'subject', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
                      <textarea
                        value={template.body}
                        onChange={(e) => handleTemplateChange(key, 'body', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use {{variable}} for dynamic content
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
} 