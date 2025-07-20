import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { fetchDashboardSummary } from '../../../services/dashboard';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PerformanceChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary().then(res => {
      setData(res.performance);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="bg-white rounded-2xl p-6 shadow mb-8 animate-pulse h-64" />;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Current Period',
        data: data.current,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124,58,237,0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Previous Period',
        data: data.previous,
        borderColor: '#a5b4fc',
        backgroundColor: 'rgba(165,180,252,0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
      x: { grid: { color: '#f3f4f6' } },
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-gray-800">Performance Overview</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-violet-100 text-violet-700 text-xs font-semibold">Monthly</button>
          <button className="px-3 py-1 rounded text-gray-500 text-xs font-semibold hover:bg-gray-100">Weekly</button>
          <button className="px-3 py-1 rounded text-gray-500 text-xs font-semibold hover:bg-gray-100">Daily</button>
        </div>
      </div>
      <Line data={chartData} options={options} height={80} />
    </div>
  );
} 