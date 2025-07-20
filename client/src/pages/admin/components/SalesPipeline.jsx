import { useEffect, useState } from 'react';
import { fetchDashboardSummary } from '../../../services/dashboard';

export default function SalesPipeline() {
  const [stages, setStages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary().then(res => {
      setStages(res.salesPipeline);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="bg-white rounded-2xl p-6 shadow mb-8 animate-pulse h-44" />;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-gray-800">Sales Pipeline</div>
        <a href="#" className="text-xs text-violet-600 font-semibold hover:underline">View Details</a>
      </div>
      <div className="flex flex-col gap-3 mb-4">
        {stages.map((stage) => (
          <div key={stage.label} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-violet-400`}></div>
            <div className="flex-1 text-sm text-gray-700">{stage.label}</div>
            <div className="w-2/5 bg-gray-100 rounded h-2 mx-2">
              <div className={`h-2 rounded bg-violet-400`} style={{ width: `${stage.value * 7}%` }}></div>
            </div>
            <div className="text-xs text-gray-500 w-6 text-right">{stage.value}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
        <div>Total Value <span className="text-lg text-gray-800 font-bold ml-1">$1,245,300</span></div>
        <div>Conversion Rate <span className="text-lg text-gray-800 font-bold ml-1">8.3%</span></div>
        <div>Avg. Deal Size <span className="text-lg text-gray-800 font-bold ml-1">$24,906</span></div>
      </div>
    </div>
  );
} 