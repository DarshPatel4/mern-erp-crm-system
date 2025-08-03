const API_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Role Management
export const fetchRoles = async () => {
  const response = await fetch(`${API_URL}/roles`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const createRole = async (roleData) => {
  const response = await fetch(`${API_URL}/roles`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(roleData)
  });
  return response.json();
};

export const updateRole = async (id, roleData) => {
  const response = await fetch(`${API_URL}/roles/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(roleData)
  });
  return response.json();
};

export const deleteRole = async (id) => {
  const response = await fetch(`${API_URL}/roles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return response.json();
};

// Company Profile
export const fetchCompanyProfile = async () => {
  const response = await fetch(`${API_URL}/settings/company-profile`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const updateCompanyProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/settings/company-profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  });
  return response.json();
};

export const uploadCompanyLogo = async (logoData) => {
  const response = await fetch(`${API_URL}/settings/company-profile/logo`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(logoData)
  });
  return response.json();
};

// Email & SMS Config
export const fetchEmailSmsConfig = async () => {
  const response = await fetch(`${API_URL}/settings/email-sms-config`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const updateEmailSmsConfig = async (configData) => {
  const response = await fetch(`${API_URL}/settings/email-sms-config`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(configData)
  });
  return response.json();
};

export const testEmail = async (emailData) => {
  const response = await fetch(`${API_URL}/settings/email-sms-config/test-email`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(emailData)
  });
  return response.json();
};

export const testSms = async (smsData) => {
  const response = await fetch(`${API_URL}/settings/email-sms-config/test-sms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(smsData)
  });
  return response.json();
};

// Document Branding
export const fetchDocumentBranding = async () => {
  const response = await fetch(`${API_URL}/settings/document-branding`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const updateDocumentBranding = async (brandingData) => {
  const response = await fetch(`${API_URL}/settings/document-branding`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(brandingData)
  });
  return response.json();
};

export const uploadDocumentLogo = async (logoData) => {
  const response = await fetch(`${API_URL}/settings/document-branding/logo`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(logoData)
  });
  return response.json();
};

// Notification Preferences
export const fetchNotificationPreferences = async () => {
  const response = await fetch(`${API_URL}/settings/notification-preferences`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const updateNotificationPreferences = async (preferencesData) => {
  const response = await fetch(`${API_URL}/settings/notification-preferences`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(preferencesData)
  });
  return response.json();
};

// Theme Settings
export const fetchThemeSettings = async () => {
  const response = await fetch(`${API_URL}/settings/theme-settings`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const updateThemeSettings = async (settingsData) => {
  const response = await fetch(`${API_URL}/settings/theme-settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settingsData)
  });
  return response.json();
};

export const resetThemeSettings = async () => {
  const response = await fetch(`${API_URL}/settings/theme-settings/reset`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return response.json();
}; 