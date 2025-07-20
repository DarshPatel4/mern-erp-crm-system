const API_URL = 'http://localhost:5000/api/dashboard/summary';

export async function fetchDashboardSummary() {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
} 