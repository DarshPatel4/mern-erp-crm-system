import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TaskStatusChart({ data }) {
  const completed = data?.completed || 0;
  const inProgress = data?.inProgress || 0;
  const pending = data?.pending || 0;
  const overdue = data?.overdue || 0;
  const total = completed + inProgress + pending + overdue;

  const chartData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [completed, inProgress, pending, overdue],
        backgroundColor: [
          'rgb(34, 197, 94)',   // Green for completed
          'rgb(59, 130, 246)',  // Blue for in progress
          'rgb(245, 158, 11)',  // Yellow for pending
          'rgb(239, 68, 68)'    // Red for overdue
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
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Total Tasks */}
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900">{total.toLocaleString()}</div>
        <div className="text-sm text-gray-600">Total Tasks</div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-900">{completed.toLocaleString()}</div>
          <div className="text-sm text-green-600">Completed</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">{inProgress.toLocaleString()}</div>
          <div className="text-sm text-blue-600">In Progress</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-900">{pending.toLocaleString()}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-900">{overdue.toLocaleString()}</div>
          <div className="text-sm text-red-600">Overdue</div>
        </div>
      </div>
    </div>
  );
}
