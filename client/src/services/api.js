const API_URL = 'http://localhost:5000/api';

export async function signup({ name, email, password, role }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Optionally notify backend
  fetch(`${API_URL}/auth/logout`, { method: 'POST' });
}

export async function getAdminData() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/protected/admin-data`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
} 