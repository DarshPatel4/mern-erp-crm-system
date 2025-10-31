const API_BASE = 'http://localhost:5000/api';

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem('token');
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  };

  if (body !== undefined) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = payload?.error || payload?.message || 'Request failed';
    throw new Error(errorMessage);
  }

  return payload;
}

export function getDashboardSummary(employeeId) {
  return request(`/employee-dashboard/summary/${employeeId}`);
}

export function getAttendance(employeeId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/employee-dashboard/attendance/${employeeId}${suffix}`);
}

export function markAttendance(employeeId) {
  return request('/attendance/mark', {
    method: 'POST',
    body: { employeeId }
  });
}

export function checkIn(employeeId) {
  return request(`/employee-attendance/check-in/${employeeId}`, { method: 'POST' });
}

export function checkOut(employeeId) {
  return request(`/employee-attendance/check-out/${employeeId}`, { method: 'POST' });
}

export function startBreak(employeeId) {
  return request(`/employee-attendance/start-break/${employeeId}`, { method: 'POST' });
}

export function endBreak(employeeId) {
  return request(`/employee-attendance/end-break/${employeeId}`, { method: 'POST' });
}

export function getTodayAttendanceStatus(employeeId) {
  return request(`/employee-attendance/today-status/${employeeId}`);
}

export function getMonthlyAttendanceSummary(employeeId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/employee-attendance/monthly-summary/${employeeId}${suffix}`);
}

export function getTasks(employeeId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/employee-dashboard/tasks/${employeeId}${suffix}`);
}

export function updateTaskStatus(taskId, status) {
  return request(`/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: { status }
  });
}

export function getLeaves(employeeId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/employee-leave/requests/${employeeId}${suffix}`);
}

export function applyLeave(payload) {
  return request(`/employee-leave/apply/${payload.employeeId}`, {
    method: 'POST',
    body: payload
  });
}

export function getPayroll(employeeId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/employee-payroll/data/${employeeId}${suffix}`);
}

export function getEmployeeProfile(employeeId) {
  return request(`/employee-profile/${employeeId}`);
}

export function updateEmployeeProfile(employeeId, data) {
  return request(`/employee-profile/${employeeId}`, {
    method: 'PUT',
    body: data
  });
}

export function updateProfilePicture(employeeId, profilePicture) {
  return request(`/employee-profile/${employeeId}/picture`, {
    method: 'PUT',
    body: { profilePicture }
  });
}

export function getNotifications(employeeId) {
  return request(`/employee-dashboard/notifications/${employeeId}`);
}

export function markNotificationRead(employeeId, notificationId) {
  return request(`/employee-dashboard/notifications/${notificationId}/read`, {
    method: 'PUT'
  });
}

