const API_URL = 'http://localhost:5000/api/leaves';

export async function fetchLeaves({ employee = '', status = '' } = {}) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();
  if (employee) params.append('employee', employee);
  if (status) params.append('status', status);
  const res = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
} 