import { useEffect, useState } from 'react';
import { FaSave, FaFileInvoice, FaPlus, FaTrash } from 'react-icons/fa';
import { createInvoice, getNextInvoiceNumber } from '../../services/invoice';
import { useNavigate } from 'react-router-dom';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [issueDate, setIssueDate] = useState(()=> new Date().toISOString().slice(0,10));
  const [dueDate, setDueDate] = useState(()=> new Date(Date.now()+ 1000*60*60*24*30).toISOString().slice(0,10));
  const [status, setStatus] = useState('Draft');
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState([{ itemName: '', description: '', quantity: 1, price: 0, discount: 0, tax: 0 }]);

  useEffect(()=> {
    (async ()=> setInvoiceNumber(await getNextInvoiceNumber()))();
  }, []);

  function computeItemTotal(it){
    const subtotal = (Number(it.quantity)||0) * (Number(it.price)||0);
    return Math.max(0, subtotal - (Number(it.discount)||0) + (Number(it.tax)||0));
  }
  const subtotal = items.reduce((s,it)=> s + (Number(it.quantity)||0) * (Number(it.price)||0), 0);
  const discount = items.reduce((s,it)=> s + (Number(it.discount)||0), 0);
  const tax = items.reduce((s,it)=> s + (Number(it.tax)||0), 0);
  const total = Math.max(0, subtotal - discount + tax);

  function updateItem(idx, field, value){
    setItems(prev => prev.map((it,i)=> i===idx? { ...it, [field]: value }: it));
  }

  function addItem(){ setItems(prev => [...prev, { itemName: '', description: '', quantity: 1, price: 0, discount: 0, tax: 0 }]); }
  function removeItem(idx){ setItems(prev => prev.filter((_,i)=> i!==idx)); }

  async function save(asDraft=false){
    const payload = {
      invoiceNumber,
      clientName,
      issueDate,
      dueDate,
      status: asDraft? 'Draft' : 'Unpaid',
      notes,
      currency,
      items: items.map(it=> ({
        ...it,
        quantity: Number(it.quantity)||0,
        price: Number(it.price)||0,
        discount: Number(it.discount)||0,
        tax: Number(it.tax)||0,
      })),
    };
    await createInvoice(payload);
    navigate('/admin/invoices');
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Invoice
              </h1>
              <p className="text-gray-600 mt-1">Generate a new invoice for your client</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={()=> save(true)} 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                <FaSave/> Save as Draft
              </button>
              <button 
                onClick={()=> save(false)} 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                <FaFileInvoice/> Generate Invoice
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Client Information</h3>
            <Field label="Client Name*" icon="👤">
              <input 
                value={clientName} 
                onChange={(e)=> setClientName(e.target.value)} 
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                placeholder="Enter client name"
              />
            </Field>
            <Field label="Invoice Date*" icon="📅">
              <input 
                type="date" 
                value={issueDate} 
                onChange={(e)=> setIssueDate(e.target.value)} 
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </Field>
            <Field label="Payment Terms" icon="⏰">
              <select className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                <option>Net 30</option>
                <option>Net 15</option>
                <option>Due on Receipt</option>
              </select>
            </Field>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Invoice Settings</h3>
            <Field label="Invoice Number" icon="🔢">
              <input 
                value={invoiceNumber} 
                onChange={(e)=> setInvoiceNumber(e.target.value)} 
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-50"
                readOnly
              />
            </Field>
            <Field label="Due Date*" icon="⏳">
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e)=> setDueDate(e.target.value)} 
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </Field>
            <Field label="Currency" icon="💱">
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Invoice Items</h3>
            <button 
              onClick={addItem} 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              <FaPlus/> Add Item
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <tr>
                  {['Item','Description','Quantity','Price','Discount','Tax','Total',''].map(h=> <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>)}
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map((it, idx)=> (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input 
                        value={it.itemName} 
                        onChange={(e)=> updateItem(idx,'itemName', e.target.value)} 
                        className="border-2 border-gray-200 rounded-lg px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                        placeholder="Item name"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        value={it.description} 
                        onChange={(e)=> updateItem(idx,'description', e.target.value)} 
                        className="border-2 border-gray-200 rounded-lg px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        value={it.quantity} 
                        onChange={(e)=> updateItem(idx,'quantity', e.target.value)} 
                        className="border-2 border-gray-200 rounded-lg px-3 py-2 w-20 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        step="0.01"
                        value={it.price} 
                        onChange={(e)=> updateItem(idx,'price', e.target.value)} 
                        className="border-2 border-gray-200 rounded-lg px-3 py-2 w-24 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        step="0.01"
                        value={it.discount} 
                        onChange={(e)=> updateItem(idx,'discount', e.target.value)} 
                        className="border-2 border-gray-200 rounded-lg px-3 py-2 w-24 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        step="0.01"
                        value={it.tax} 
                        onChange={(e)=> updateItem(idx,'tax', e.target.value)} 
                        className="border-2 border-gray-200 rounded-lg px-3 py-2 w-24 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">${computeItemTotal(it).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={()=> removeItem(idx)} 
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                        disabled={items.length === 1}
                      >
                        <FaTrash/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Notes</h3>
              <textarea 
                value={notes} 
                onChange={(e)=> setNotes(e.target.value)} 
                className="w-full min-h-[120px] border-2 border-gray-200 rounded-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none" 
                placeholder="Additional notes or payment instructions..."
              />
            </div>
          </div>
          <div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 space-y-3">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Summary</h3>
              <Row label="Subtotal:" value={subtotal.toFixed(2)} currency={currency}/>
              <Row label="Discount:" value={discount.toFixed(2)} currency={currency}/>
              <Row label="Tax:" value={tax.toFixed(2)} currency={currency}/>
              <div className="border-t border-gray-300 pt-3 mt-3">
                <Row label="Total:" value={total.toFixed(2)} bold currency={currency}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children, icon }){
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        {icon && <span>{icon}</span>}
        {label}
      </div>
      {children}
    </label>
  );
}

function Row({ label, value, bold, currency = 'USD' }){
  const getCurrencySymbol = (curr) => {
    switch(curr) {
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  return (
    <div className="flex justify-between text-sm">
      <div className="text-gray-600">{label}</div>
      <div className={`font-semibold ${bold ? 'text-lg text-gray-900' : 'text-gray-800'}`}>
        {getCurrencySymbol(currency)}{value}
      </div>
    </div>
  );
}


