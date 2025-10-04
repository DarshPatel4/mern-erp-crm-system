const API_URL = 'http://localhost:5000/api/tasks';

export async function fetchTasks({ page = 1, limit = 10, search = '', status = '', priority = '', assigned_to = '' }) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({ page, limit, search, status, priority, assigned_to });
  const res = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function fetchTasksForKanban({ search = '', assigned_to = '', priority = '' }) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({ search, assigned_to, priority });
  const res = await fetch(`${API_URL}/kanban?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function createTask(data) {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getTaskById(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function updateTask(id, data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTaskStatus(id, status) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function deleteTask(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
