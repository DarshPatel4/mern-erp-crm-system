const API_URL = 'http://localhost:5000/api';

export const getAnalyticsData = async (filter = '30days') => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/analytics?filter=${filter}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

export const exportAnalytics = async (format, filter = '30days') => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/analytics/export?format=${format}&filter=${filter}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.blob();
  } catch (error) {
    console.error('Error exporting analytics:', error);
    throw error;
  }
};
