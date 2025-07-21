const API_URL = 'http://localhost:5000/api/employees';

export async function fetchEmployees({ page = 1, limit = 10, search = '', department = '', status = '' }) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({ page, limit, search, department, status });
  const res = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
} 