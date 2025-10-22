import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function EmployeePerformanceChart({ data }) {
  const chartData = {
    labels: data?.departments || [],
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: data?.completionRates || [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Development - Green
          'rgba(59, 130, 246, 0.8)',  // Sales - Blue
          'rgba(168, 85, 247, 0.8)',  // Marketing - Purple
          'rgba(236, 72, 153, 0.8)',  // HR - Pink
          'rgba(245, 158, 11, 0.8)'   // Finance - Yellow
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(236, 72, 153)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            return `Completion Rate: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6B7280',
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}
