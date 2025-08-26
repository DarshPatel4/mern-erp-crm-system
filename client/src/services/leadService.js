const API_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Fetch lead statistics
export const fetchLeadStats = async () => {
  try {
    const response = await fetch(`${API_URL}/leads/stats`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch lead stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    throw error;
  }
};

// Fetch leads with pagination, sorting, and filtering
export const fetchLeads = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add all parameters to query string
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const url = `${API_URL}/leads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

// Fetch a single lead by ID
export const fetchLeadById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch lead');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching lead:', error);
    throw error;
  }
};

// Create a new lead
export const createLead = async (leadData) => {
  try {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leadData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create lead');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

// Update an existing lead
export const updateLead = async (id, leadData) => {
  try {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(leadData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update lead');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
};

// Delete a lead (soft delete)
export const deleteLead = async (id) => {
  try {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete lead');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
};

// Fetch employees for assignment dropdown
export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_URL}/leads/employees`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Export leads to CSV
export const exportLeads = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add all parameters to query string
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const url = `${API_URL}/leads/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to export leads');
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a download link
    const url2 = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url2;
    a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url2);
    document.body.removeChild(a);
    
    return { success: true };
  } catch (error) {
    console.error('Error exporting leads:', error);
    throw error;
  }
}; 