const API_URL = 'http://localhost:5000/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function fetchInvoices(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/invoices?${query}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to fetch invoices');
  return res.json();
}

export async function fetchInvoice(id) {
  const res = await fetch(`${API_URL}/invoices/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch invoice');
  return res.json();
}

export async function getNextInvoiceNumber() {
  const res = await fetch(`${API_URL}/invoices/next-number`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to get invoice number');
  const data = await res.json();
  return data.invoiceNumber;
}

export async function createInvoice(payload) {
  const res = await fetch(`${API_URL}/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create invoice');
  return res.json();
}

export async function updateInvoice(id, payload) {
  const res = await fetch(`${API_URL}/invoices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update invoice');
  return res.json();
}

export async function deleteInvoice(id) {
  const res = await fetch(`${API_URL}/invoices/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete invoice');
  return res.json();
}

export async function downloadInvoicePDF(id) {
  try {
    console.log('Downloading PDF for invoice ID:', id);
    const res = await fetch(`${API_URL}/invoices/${id}/download`, {
      headers: authHeaders(),
    });
    
    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to download invoice PDF: ${res.status} ${errorText}`);
    }
    
    const blob = await res.blob();
    console.log('Blob received, size:', blob.size);
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    console.log('PDF download initiated successfully');
  } catch (error) {
    console.error('Error in downloadInvoicePDF:', error);
    throw error;
  }
}


