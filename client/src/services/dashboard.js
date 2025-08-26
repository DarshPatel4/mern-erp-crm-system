import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/dashboard/summary';

export async function fetchDashboardSummary() {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }
  
  return res.json();
}

// Custom hook for dashboard data with auto-refresh capability
export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchDashboardSummary();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 2 minutes
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refreshData };
}; 