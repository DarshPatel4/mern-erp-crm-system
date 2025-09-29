import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaFileInvoice, FaDownload } from 'react-icons/fa';
import { fetchInvoice, downloadInvoicePDF } from '../../services/invoice';

export default function InvoiceView(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(()=>{ 
    (async()=> {
      try {
        setLoading(true);
        const invoiceData = await fetchInvoice(id);
        setData(invoiceData);
      } catch (error) {
        console.error('Error loading invoice:', error);
      } finally {
        setLoading(false);
      }
    })();
  },[id]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      await downloadInvoicePDF(id);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download invoice PDF');
    } finally {
      setDownloading(false);
    }
  };

  if(loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if(!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <FaFileInvoice className="text-6xl text-gray-400 mx-auto mb-4"/>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-4">The invoice you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/admin/invoices')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto h-[calc(100vh-80px)]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/admin/invoices')} 
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {data.invoiceNumber}
                </h1>
                <p className="text-gray-600 mt-1">Invoice Details</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                data.status==='Paid'?'bg-green-100 text-green-800':
                data.status==='Overdue'?'bg-red-100 text-red-800':
                data.status==='Draft'?'bg-gray-100 text-gray-800':
                'bg-yellow-100 text-yellow-800'
              }`}>
                {data.status}
              </span>
              <button 
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaDownload/> {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
              <button 
                onClick={() => navigate(`/admin/invoices/${id}/edit`)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                <FaEdit/> Edit Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Invoice Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-500">Client Name</div>
              <div className="text-lg font-semibold text-gray-900">{data.clientName}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-500">Total Amount</div>
              <div className="text-lg font-semibold text-gray-900">${data.amount.toFixed(2)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-500">Issue Date</div>
              <div className="text-lg font-semibold text-gray-900">{new Date(data.issueDate).toLocaleDateString()}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-500">Due Date</div>
              <div className="text-lg font-semibold text-gray-900">{new Date(data.dueDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Invoice Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <tr>
                  {['Item','Description','Quantity','Price','Discount','Tax','Total'].map(h=> (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.items.map((it,idx)=> (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{it.itemName}</td>
                    <td className="px-4 py-3 text-gray-700">{it.description || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{it.quantity}</td>
                    <td className="px-4 py-3 text-gray-700">${it.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-700">${(it.discount||0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-700">${(it.tax||0).toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${it.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Notes</h3>
            <div className="text-gray-700 whitespace-pre-wrap">{data.notes}</div>
          </div>
        )}
      </div>
    </main>
  );
}


