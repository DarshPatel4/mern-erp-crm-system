export default function LeadDistributionChart({ data }) {
  const regions = data?.regions || [];
  const maxLeads = Math.max(...regions.map(r => r.count), 1);

  return (
    <div className="space-y-4">
      {regions.map((region, index) => {
        const percentage = (region.count / maxLeads) * 100;
        const colors = [
          'bg-blue-500',
          'bg-green-500', 
          'bg-purple-500',
          'bg-orange-500',
          'bg-pink-500',
          'bg-indigo-500'
        ];
        
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{region.name}</span>
              <span className="text-sm text-gray-500">{region.count} leads</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${colors[index % colors.length]} transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              {((region.count / regions.reduce((sum, r) => sum + r.count, 0)) * 100).toFixed(1)}% of total
            </div>
          </div>
        );
      })}
      
      {regions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No lead data available</div>
          <div className="text-sm">Leads will appear here once they are added to the system</div>
        </div>
      )}
    </div>
  );
}
