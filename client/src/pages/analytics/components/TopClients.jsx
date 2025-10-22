import { FaBuilding, FaDollarSign } from 'react-icons/fa';

export default function TopClients({ data }) {
  const clients = data || [];

  return (
    <div className="space-y-4">
      {clients.length > 0 ? (
        clients.map((client, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <FaBuilding className="text-violet-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{client.name}</div>
                <div className="text-sm text-gray-600">{client.industry}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 flex items-center gap-1">
                <FaDollarSign className="text-green-600" />
                {client.totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{client.invoiceCount} invoices</div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No client data available</div>
          <div className="text-sm">Top clients will appear here once invoices are created</div>
        </div>
      )}
    </div>
  );
}
