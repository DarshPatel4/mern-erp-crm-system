const API_URL = 'http://localhost:5000/api/attendance';

export async function fetchAttendance({ employee = '', month = '' } = {}) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();
  if (employee) params.append('employee', employee);
  if (month) params.append('month', month);
  const res = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
} 