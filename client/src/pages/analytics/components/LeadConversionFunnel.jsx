import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LeadConversionFunnel({ data }) {
  const totalLeads = data?.totalLeads || 0;
  const opportunities = data?.opportunities || 0;
  const converted = data?.converted || 0;
  const conversionRate = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : 0;

  const chartData = {
    labels: ['Converted', 'Opportunities', 'New Leads'],
    datasets: [
      {
        data: [converted, opportunities, totalLeads - opportunities - converted],
        backgroundColor: [
          'rgb(34, 197, 94)', // Green for converted
          'rgb(59, 130, 246)', // Blue for opportunities
          'rgb(156, 163, 175)'  // Gray for new leads
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = ((value / totalLeads) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Conversion Rate Display */}
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900">{conversionRate}%</div>
        <div className="text-sm text-gray-600">Conversion Rate</div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-gray-900">{totalLeads}</div>
          <div className="text-xs text-gray-600">Total Leads</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-blue-900">{opportunities}</div>
          <div className="text-xs text-blue-600">Opportunities</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-green-900">{converted}</div>
          <div className="text-xs text-green-600">Converted</div>
        </div>
      </div>
    </div>
  );
}
