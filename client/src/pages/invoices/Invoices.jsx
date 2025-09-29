import { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaSearch, FaEye, FaPen, FaTrash, FaDownload } from 'react-icons/fa';
import { fetchInvoices, deleteInvoice, downloadInvoicePDF } from '../../services/invoice';
import { useNavigate } from 'react-router-dom';

export default function Invoices() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [client, setClient] = useState('All');
  const [date, setDate] = useState('');
  const [downloading, setDownloading] = useState(null);

  const pageCount = useMemo(() => Math.ceil(total / limit) || 1, [total, limit]);

  async function load() {
    setLoading(true);
    const params = { page, limit, q, status, client };
    if (date) params.startDate = date;
    const data = await fetchInvoices(params);
    setRows(data.data);
    setTotal(data.total);
    setStats(data.stats);
    setLoading(false);
  }

  useEffect(() => { load(); }, [page, limit, status, client]);

  function formatCurrency(v) { return (v || 0).toLocaleString(undefined, { style: 'currency', currency: 'USD' }); }

  async function onDelete(id) {
    if (!window.confirm('Delete this invoice?')) return;
    await deleteInvoice(id);
    load();
  }

  async function handleDownloadPDF(id) {
    try {
      setDownloading(id);
      await downloadInvoicePDF(id);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download invoice PDF');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Invoice Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and track your invoices and billing</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <button 
                onClick={() => navigate('/admin/invoices/create')} 
                className="flex items-center gap-2 px-3 py-2 lg:px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm lg:text-base"
              >
                <FaPlus size={12} className="lg:w-3.5 lg:h-3.5" />
                <span className="hidden sm:inline">Create Invoice</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            title="Total Invoices" 
            value={stats?.totalInvoices} 
            sub={stats ? `${stats.invoicesChange.toFixed(1)}% from last month` : ''} 
            icon="📊"
            iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
            iconColor="text-white"
          />
          <Card 
            title="Total Revenue" 
            value={formatCurrency(stats?.totalRevenue)} 
            sub={stats ? `${stats.revenueChange.toFixed(1)}% from last month` : ''} 
            icon="💰"
            iconBg="bg-gradient-to-br from-green-500 to-green-600"
            iconColor="text-white"
          />
          <Card 
            title="Unpaid Invoices" 
            value={stats?.unpaidCount} 
            sub={stats ? `${formatCurrency(stats.unpaidAmount)} pending` : ''} 
            icon="⏳"
            iconBg="bg-gradient-to-br from-yellow-500 to-yellow-600"
            iconColor="text-white"
          />
          <Card 
            title="Overdue Invoices" 
            value={stats?.overdueCount} 
            sub={stats ? `${formatCurrency(stats.overdueAmount)} overdue` : ''} 
            icon="⚠️"
            iconBg="bg-gradient-to-br from-red-500 to-red-600"
            iconColor="text-white"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border p-4 lg:p-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-64">
              <FaSearch className="absolute left-3 top-3 text-gray-400"/>
              <input 
                value={q} 
                onChange={(e)=>setQ(e.target.value)} 
                onKeyDown={(e)=> e.key==='Enter'&& (setPage(1), load())} 
                className="pl-9 pr-3 py-2 border-2 border-gray-200 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                placeholder="Search by ID or Client"
              />
            </div>
            <select 
              value={status} 
              onChange={(e)=>{setStatus(e.target.value); setPage(1);}} 
              className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              {['All','Paid','Unpaid','Overdue','Draft'].map(s=> <option key={s}>{s}</option>)}
            </select>
            <input 
              type="date" 
              value={date} 
              onChange={(e)=>{setDate(e.target.value); setPage(1); load();}} 
              className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <button 
              onClick={()=>{setPage(1); load();}} 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {['Invoice ID','Client Name','Amount','Date','Due Date','Status','Actions'].map(h=> (
                    <th key={h} className="text-left px-6 py-4 font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading && (
                  <tr><td className="px-6 py-8 text-center text-gray-500" colSpan={7}>
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                      Loading invoices...
                    </div>
                  </td></tr>
                )}
                {!loading && rows.length===0 && (
                  <tr><td className="px-6 py-8 text-center text-gray-500" colSpan={7}>No invoices found</td></tr>
                )}
                {!loading && rows.map((r)=> (
                  <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{r.invoiceNumber}</td>
                    <td className="px-6 py-4 text-gray-700">{r.clientName}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(r.amount)}</td>
                    <td className="px-6 py-4 text-gray-700">{new Date(r.issueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-700">{new Date(r.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        r.status==='Paid'?'bg-green-100 text-green-800':
                        r.status==='Overdue'?'bg-red-100 text-red-800':
                        r.status==='Draft'?'bg-gray-100 text-gray-800':
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={()=> navigate(`/admin/invoices/${r._id}`)} 
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                          title="View Invoice"
                        >
                          <FaEye/>
                        </button>
                        <button 
                          onClick={()=> navigate(`/admin/invoices/${r._id}/edit`)} 
                          className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                          title="Edit Invoice"
                        >
                          <FaPen/>
                        </button>
                        <button 
                          onClick={()=> handleDownloadPDF(r._id)} 
                          disabled={downloading === r._id}
                          className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors disabled:opacity-50"
                          title="Download PDF"
                        >
                          <FaDownload/>
                        </button>
                        <button 
                          onClick={()=> onDelete(r._id)} 
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                          title="Delete Invoice"
                        >
                          <FaTrash/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <div className="text-sm text-gray-600">
              Page {page} of {pageCount} ({total} total invoices)
            </div>
            <div className="flex items-center gap-2">
              <button 
                disabled={page<=1} 
                onClick={()=> setPage(p=> Math.max(1, p-1))} 
                className="px-4 py-2 border-2 border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                Previous
              </button>
              <button 
                disabled={page>=pageCount} 
                onClick={()=> setPage(p=> Math.min(pageCount, p+1))} 
                className="px-4 py-2 border-2 border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({ title, value, sub, icon, iconBg, iconColor }){
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-gray-700">{title}</div>
        <div className={`p-3 rounded-full ${iconBg}`}>
          <span className={`text-2xl ${iconColor || 'text-white'}`}>{icon}</span>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="text-3xl font-bold text-gray-900">{value ?? '-'}</div>
      </div>
      {sub && <div className="text-sm text-gray-500 mt-2">{sub}</div>}
    </div>
  );
}


